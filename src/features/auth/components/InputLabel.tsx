import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  type LayoutRectangle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Spacing, BorderRadius } from '@/theme';

type InputLabelProps = {
  /** Label text */
  label: string;
  /** Optional help description — shows ℹ icon that opens a popover */
  helpDescription?: string;
};

export function InputLabel({ label, helpDescription }: InputLabelProps) {
  const [showHelp, setShowHelp] = useState(false);
  const [iconLayout, setIconLayout] = useState<LayoutRectangle | null>(null);
  const iconRef = useRef<View>(null);

  const handleHelpPress = () => {
    iconRef.current?.measureInWindow((x, y, width, height) => {
      setIconLayout({ x, y, width, height });
      setShowHelp(true);
    });
  };

  return (
    <>
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        {helpDescription && (
          <Pressable ref={iconRef} onPress={handleHelpPress} hitSlop={10}>
            <Ionicons name="help-circle-outline" size={16} color={Colors.grayNeutral} />
          </Pressable>
        )}
      </View>

      {helpDescription && showHelp && iconLayout && (
        <Modal transparent animationType="fade" visible={showHelp} onRequestClose={() => setShowHelp(false)}>
          <Pressable style={styles.backdrop} onPress={() => setShowHelp(false)}>
            <View
              style={[
                styles.bubble,
                {
                  top: iconLayout.y + iconLayout.height + 8,
                  left: Math.max(16, Math.min(iconLayout.x - 100, 280)),
                },
              ]}
            >
              <Text style={styles.bubbleText}>{helpDescription}</Text>
              {/* Arrow pointing up */}
              <View
                style={[
                  styles.arrow,
                  { left: Math.max(12, iconLayout.x - Math.max(16, iconLayout.x - 100) + 2) },
                ]}
              />
            </View>
          </Pressable>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
    marginLeft: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.grayNeutral,
  },

  /* ─── Popover ─────────────────────────────────────── */
  backdrop: {
    flex: 1,
  },
  bubble: {
    position: 'absolute',
    width: 260,
    backgroundColor: Colors.charcoal,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },
  bubbleText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#fff',
    fontWeight: '500',
  },
  arrow: {
    position: 'absolute',
    top: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Colors.charcoal,
  },
});
