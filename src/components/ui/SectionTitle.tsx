import React from 'react';
import { Text, StyleSheet } from 'react-native';

import { Typography } from '@/theme';

type SectionTitleProps = {
  /** Title text */
  title: string;
};

export function SectionTitle({ title }: SectionTitleProps) {
  return <Text style={styles.title}>{title}</Text>;
}

const styles = StyleSheet.create({
  title: {
    ...Typography.sectionTitle,
    marginBottom: 20,
  },
});
