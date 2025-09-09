import React from "react";
import { View, ViewStyle } from "react-native";
import { Colors, Spacing, BorderRadius, Shadows } from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof Spacing;
  shadow?: keyof typeof Shadows;
}

export default function Card({
  children,
  style,
  padding = "md",
  shadow = "none",
}: CardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const cardStyle: ViewStyle = {
    backgroundColor: colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing[padding],
    borderWidth: 1,
    borderColor: colors.border,
    ...Shadows[shadow],
    ...style,
  };

  return <View style={cardStyle}>{children}</View>;
}

export function CardHeader({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[{ marginBottom: Spacing.md }, style]}>{children}</View>;
}

export function CardTitle({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <View
      style={[
        {
          fontSize: 20,
          fontWeight: "600",
          color: colors.cardForeground,
          marginBottom: Spacing.xs,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function CardContent({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={style}>{children}</View>;
}

export function CardFooter({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[{ marginTop: Spacing.md }, style]}>{children}</View>;
}
