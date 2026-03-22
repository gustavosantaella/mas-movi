import React, { useEffect, useRef, ReactNode } from 'react';
import {
  View,
  Animated,
  Pressable,
  PanResponder,
  Dimensions,
  StyleSheet,
} from 'react-native';

import { Colors } from '@/theme';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const DISMISS_THRESHOLD = 120;

interface BottomSheetProps {
  children: ReactNode;
  onDismiss: () => void;
}

export function BottomSheet({ children, onDismiss }: BottomSheetProps) {
  const sheetTranslateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    Animated.spring(sheetTranslateY, {
      toValue: 0,
      damping: 25,
      stiffness: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  const dismiss = (callback?: () => void) => {
    Animated.timing(sheetTranslateY, {
      toValue: SCREEN_HEIGHT,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      if (callback) callback();
      else onDismiss();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, g) =>
        g.dy > 10 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) {
          sheetTranslateY.setValue(g.dy);
        }
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > DISMISS_THRESHOLD || g.vy > 0.5) {
          dismiss();
        } else {
          Animated.spring(sheetTranslateY, {
            toValue: 0,
            damping: 25,
            stiffness: 200,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  return (
    <View style={s.overlay}>
      {/* Backdrop — static, no animation */}
      <View style={s.backdrop}>
        <Pressable style={{ flex: 1 }} onPress={() => dismiss()} />
      </View>

      {/* Sheet — animated */}
      <Animated.View
        style={[s.sheet, { transform: [{ translateY: sheetTranslateY }] }]}
        {...panResponder.panHandlers}
      >
        <View style={s.handle} />
        {children}
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: Colors.bgWhite,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    maxHeight: '85%',
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
});
