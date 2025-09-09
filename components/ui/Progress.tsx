import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Colors, BorderRadius } from '@/constants/Theme';
import { useColorScheme } from '@/hooks/useColorScheme';

interface ProgressProps {
  value: number;
  max?: number;
  style?: ViewStyle;
  height?: number;
}

export default function Progress({
  value,
  max = 100,
  style,
  height = 8,
}: ProgressProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const containerStyle: ViewStyle = {
    height,
    backgroundColor: colors.muted,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    ...style,
  };

  const fillStyle: ViewStyle = {
    height: '100%',
    width: `${percentage}%`,
    backgroundColor: colors.primary,
    borderRadius: BorderRadius.full,
  };

  return (
    <View style={containerStyle}>
      <View style={fillStyle} />
    </View>
  );
}
