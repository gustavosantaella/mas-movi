import React, { type PropsWithChildren, type ReactNode } from 'react';
import { View, ScrollView, StyleSheet, type ViewStyle, type NativeSyntheticEvent, type NativeScrollEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/theme';
import { useTabBarVisibility } from '@/hooks/useTabBarVisibility';
import { ScreenHeader } from './ScreenHeader';

type ScreenLayoutProps = PropsWithChildren<{
  /**
   * Custom header component. If omitted, the default ScreenHeader is rendered.
   * Pass `null` explicitly or set `showHeader={false}` to hide the header.
   */
  header?: ReactNode;

  /** Whether to show the header. Defaults to `true`. */
  showHeader?: boolean;

  /**
   * Custom tab-navigation component rendered at the bottom.
   * If omitted, nothing extra is rendered (Expo Router's native tab bar handles it).
   * Pass `null` explicitly or set `showTabNavigation={false}` to hide.
   */
  tabNavigation?: ReactNode;

  /** Whether to show the tab navigation (if a custom one is provided). Defaults to `true`. */
  showTabNavigation?: boolean;

  /** Whether content should be scrollable. Defaults to `true`. */
  scrollable?: boolean;

  /** Additional style for the scroll content container. */
  contentContainerStyle?: ViewStyle;

  /** Additional style for the root container. */
  style?: ViewStyle;
}>;

/**
 * Reusable screen wrapper with:
 * - White background
 * - Safe area insets
 * - Configurable header (default or custom or hidden)
 * - Configurable tab navigation (custom or hidden)
 * - Scroll handling with tab bar auto-hide
 */
export function ScreenLayout({
  children,
  header,
  showHeader = true,
  tabNavigation,
  showTabNavigation = true,
  scrollable = true,
  contentContainerStyle,
  style,
}: ScreenLayoutProps) {
  const insets = useSafeAreaInsets();
  const { onScroll } = useTabBarVisibility();

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    onScroll(e.nativeEvent.contentOffset.y);
  };

  // Determine which header to render
  const headerElement = !showHeader
    ? null
    : header !== undefined
      ? header
      : <ScreenHeader />;

  const content = scrollable ? (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.scrollContent, contentContainerStyle, { flex: 1 }]}>
      {children}
    </View>
  );

  // Determine which tab navigation to render
  const tabElement = !showTabNavigation ? null : tabNavigation ?? null;

  return (
    <View style={[styles.container, { paddingTop: insets.top }, style]}>
      {headerElement}
      {content}
      {tabElement}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgWhite,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
});
