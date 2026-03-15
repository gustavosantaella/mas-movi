import React, { createContext, useContext, useRef, useCallback } from 'react';
import { Animated } from 'react-native';

type TabBarContextType = {
  translateY: Animated.Value;
  onScroll: (y: number) => void;
};

const TabBarContext = createContext<TabBarContextType>({
  translateY: new Animated.Value(0),
  onScroll: () => {},
});

export function TabBarVisibilityProvider({ children }: { children: React.ReactNode }) {
  const translateY = useRef(new Animated.Value(0)).current;
  const lastOffsetY = useRef(0);
  const isHidden = useRef(false);

  const onScroll = useCallback((currentY: number) => {
    const diff = currentY - lastOffsetY.current;
    lastOffsetY.current = currentY;

    // Scrolling down → hide tab bar
    if (diff > 5 && !isHidden.current && currentY > 30) {
      isHidden.current = true;
      Animated.spring(translateY, {
        toValue: 120,
        useNativeDriver: true,
        speed: 14,
        bounciness: 2,
      }).start();
    }

    // Scrolling up → show tab bar
    if (diff < -5 && isHidden.current) {
      isHidden.current = false;
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        speed: 14,
        bounciness: 2,
      }).start();
    }
  }, [translateY]);

  return (
    <TabBarContext.Provider value={{ translateY, onScroll }}>
      {children}
    </TabBarContext.Provider>
  );
}

export function useTabBarVisibility() {
  return useContext(TabBarContext);
}
