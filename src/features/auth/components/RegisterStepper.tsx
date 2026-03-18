import React from 'react';
import { View, StyleSheet } from 'react-native';

import { Colors } from '@/theme';

type RegisterStepperProps = {
  /** Total number of steps */
  totalSteps: number;
  /** Current step index (0-based) */
  currentStep: number;
};

export function RegisterStepper({ totalSteps, currentStep }: RegisterStepperProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, i) => (
        <React.Fragment key={i}>
          {/* Dot */}
          <View
            style={[
              styles.dot,
              i <= currentStep && styles.dotActive,
              i < currentStep && styles.dotCompleted,
            ]}
          />
          {/* Line between dots */}
          {i < totalSteps - 1 && (
            <View
              style={[
                styles.line,
                i < currentStep && styles.lineActive,
              ]}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: Colors.borderLightGray,
    backgroundColor: Colors.bgWhite,
  },
  dotActive: {
    borderColor: Colors.salmon,
    backgroundColor: Colors.bgWhite,
  },
  dotCompleted: {
    backgroundColor: Colors.salmon,
    borderColor: Colors.salmon,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.borderLightGray,
    marginHorizontal: 8,
  },
  lineActive: {
    backgroundColor: Colors.salmon,
  },
});
