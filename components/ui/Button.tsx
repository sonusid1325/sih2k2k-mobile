import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import {
  Colors,
  Spacing,
  BorderRadius,
  FontSizes,
  FontWeights,
  Shadows,
} from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  children,
  onPress,
  variant = "default",
  size = "default",
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: BorderRadius.md,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      ...Shadows.none,
    };

    // Size styles
    const sizeStyles = {
      sm: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        minHeight: 36,
      },
      default: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
        minHeight: 44,
      },
      lg: {
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        minHeight: 52,
      },
    };

    // Variant styles
    const variantStyles = {
      default: {
        backgroundColor: colors.primary,
        borderWidth: 1,
        borderColor: colors.primary,
      },
      destructive: {
        backgroundColor: colors.destructive,
        borderWidth: 0,
      },
      outline: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: colors.primary,
      },
      secondary: {
        backgroundColor: colors.secondary,
        borderWidth: 1,
        borderColor: colors.border,
      },
      ghost: {
        backgroundColor: "transparent",
        borderWidth: 0,
      },
    };

    // Disabled styles
    const disabledStyle: ViewStyle =
      disabled || loading
        ? {
            opacity: 0.5,
          }
        : {};

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...disabledStyle,
      ...style,
    };
  };

  const getTextStyle = (): TextStyle => {
    const sizeStyles = {
      sm: {
        fontSize: FontSizes.sm,
      },
      default: {
        fontSize: FontSizes.base,
      },
      lg: {
        fontSize: FontSizes.lg,
      },
    };

    const variantStyles = {
      default: {
        color: colors.primaryForeground,
      },
      destructive: {
        color: colors.destructiveForeground,
      },
      outline: {
        color: colors.foreground,
      },
      secondary: {
        color: colors.secondaryForeground,
      },
      ghost: {
        color: colors.foreground,
      },
    };

    return {
      fontWeight: FontWeights.medium,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...textStyle,
    };
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={
            variant === "outline" || variant === "ghost"
              ? colors.foreground
              : colors.primaryForeground
          }
          style={{ marginRight: Spacing.xs }}
        />
      )}
      <Text style={getTextStyle()}>{children}</Text>
    </TouchableOpacity>
  );
}
