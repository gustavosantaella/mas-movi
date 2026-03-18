import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Modal,
  StyleSheet,
  Platform,
  type TextInputProps,
  type LayoutRectangle,
  type KeyboardTypeOptions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Spacing, BorderRadius } from '@/theme';
import { PasswordValidator } from '@/features/auth/components/PasswordValidator';

/* ─── Types ────────────────────────────────────────────── */

type InputType = 'text' | 'email' | 'password' | 'number' | 'phone' | 'textarea';

type AppInputProps = {
  /** Input variant — drives keyboard type, autocomplete, secure entry, etc. */
  type?: InputType;
  /** Label displayed above the input */
  label?: string;
  /** Popover help — shows ℹ icon next to label */
  helpDescription?: string;
  /** Short inline hint displayed below the input */
  helpText?: string;
  /** Error message — displayed in red below the input */
  error?: string;
  /** Left icon (Ionicons name) */
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  /** Controlled value */
  value: string;
  /** Change handler */
  onChangeText: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Show password strength bar + checklist (only for password type) */
  showPasswordValidator?: boolean;
  /** Additional TextInput props */
  textInputProps?: Omit<TextInputProps, 'value' | 'onChangeText' | 'placeholder' | 'editable'>;
};

/* ─── Type → Config mapping ────────────────────────────── */

const TYPE_CONFIG: Record<InputType, {
  keyboardType: KeyboardTypeOptions;
  autoCapitalize: TextInputProps['autoCapitalize'];
  autoComplete: TextInputProps['autoComplete'];
  secureTextEntry: boolean;
  multiline: boolean;
}> = {
  text: { keyboardType: 'default', autoCapitalize: 'sentences', autoComplete: 'off', secureTextEntry: false, multiline: false },
  email: { keyboardType: 'email-address', autoCapitalize: 'none', autoComplete: 'email', secureTextEntry: false, multiline: false },
  password: { keyboardType: 'default', autoCapitalize: 'none', autoComplete: 'off', secureTextEntry: true, multiline: false },
  number: { keyboardType: 'numeric', autoCapitalize: 'none', autoComplete: 'off', secureTextEntry: false, multiline: false },
  phone: { keyboardType: 'phone-pad', autoCapitalize: 'none', autoComplete: 'tel', secureTextEntry: false, multiline: false },
  textarea: { keyboardType: 'default', autoCapitalize: 'sentences', autoComplete: 'off', secureTextEntry: false, multiline: true },
};

/* ─── Component ────────────────────────────────────────── */

export function AppInput({
  type = 'text',
  label,
  helpDescription,
  helpText,
  error,
  icon,
  value,
  onChangeText,
  placeholder,
  disabled = false,
  showPasswordValidator = false,
  textInputProps,
}: AppInputProps) {
  const [focused, setFocused] = useState(false);
  const [showSecure, setShowSecure] = useState(true); // true = hidden
  const [showHelp, setShowHelp] = useState(false);
  const [iconLayout, setIconLayout] = useState<LayoutRectangle | null>(null);
  const helpIconRef = useRef<View>(null);

  const config = TYPE_CONFIG[type];
  const isPassword = type === 'password';
  const isTextarea = type === 'textarea';

  const handleHelpPress = () => {
    helpIconRef.current?.measureInWindow((x, y, width, height) => {
      setIconLayout({ x, y, width, height });
      setShowHelp(true);
    });
  };

  const hasError = !!error;

  return (
    <View style={styles.container}>
      {/* ─── Label Row ────────────────────────────── */}
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {helpDescription && (
            <Pressable ref={helpIconRef} onPress={handleHelpPress} hitSlop={10}>
              <Ionicons name="help-circle-outline" size={16} color={Colors.grayNeutral} />
            </Pressable>
          )}
        </View>
      )}

      {/* ─── Input Wrapper ────────────────────────── */}
      <View
        style={[
          styles.inputWrapper,
          isTextarea && styles.inputWrapperTextarea,
          focused && styles.inputWrapperFocused,
          hasError && styles.inputWrapperError,
          disabled && styles.inputWrapperDisabled,
        ]}
      >
        {/* Left icon */}
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={focused ? Colors.salmon : Colors.grayNeutral}
            style={styles.leftIcon}
          />
        )}

        {/* Phone prefix */}
        {type === 'phone' && (
          <Text style={styles.phonePrefix}>+58</Text>
        )}

        {/* TextInput */}
        <TextInput
          style={[
            styles.input,
            isTextarea && styles.inputTextarea,
            disabled && styles.inputDisabled,
            Platform.OS === 'web' && ({ outlineStyle: 'none' } as any),
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.grayNeutral}
          keyboardType={config.keyboardType}
          autoCapitalize={config.autoCapitalize}
          autoComplete={config.autoComplete}
          secureTextEntry={isPassword && showSecure}
          multiline={config.multiline}
          numberOfLines={isTextarea ? 4 : 1}
          textAlignVertical={isTextarea ? 'top' : 'center'}
          editable={!disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...textInputProps}
        />

        {/* Password toggle */}
        {isPassword && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowSecure((v) => !v)}
          >
            <Ionicons
              name={showSecure ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={Colors.grayNeutral}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* ─── Password Validator ───────────────────── */}
      {isPassword && showPasswordValidator && (
        <PasswordValidator password={value} />
      )}

      {/* ─── Help Text ────────────────────────────── */}
      {helpText && !error && (
        <Text style={styles.helpText}>{helpText}</Text>
      )}

      {/* ─── Error Text ───────────────────────────── */}
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {/* ─── Help Description Popover ─────────────── */}
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
    </View>
  );
}

/* ─── Styles ───────────────────────────────────────────── */

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.base,
  },

  /* Label */
  labelRow: {
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

  /* Input wrapper */
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgLightGray,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLightGray,
    paddingHorizontal: Spacing.base,
    height: 54,
  },
  inputWrapperTextarea: {
    height: 120,
    alignItems: 'flex-start',
    paddingVertical: Spacing.md,
  },
  inputWrapperFocused: {
    borderColor: Colors.salmon,
    backgroundColor: Colors.bgWhite,
  },
  inputWrapperError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  inputWrapperDisabled: {
    opacity: 0.5,
  },

  /* Icons */
  leftIcon: {
    marginRight: Spacing.md,
  },
  phonePrefix: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.charcoal,
    marginRight: Spacing.sm,
  },

  /* Input */
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.charcoal,
  },
  inputTextarea: {
    height: '100%' as any,
    paddingTop: 0,
  },
  inputDisabled: {
    color: Colors.grayNeutral,
  },

  /* Eye button */
  eyeButton: {
    padding: Spacing.xs,
  },

  /* Help / Error text */
  helpText: {
    fontSize: 12,
    color: Colors.grayNeutral,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '500',
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },

  /* Popover */
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
