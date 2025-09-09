import React, { useEffect, useState } from 'react';
import { View, Text, Animated, ViewStyle, TextStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/Theme';
import { useColorScheme } from '@/hooks/useColorScheme';

interface AviatorCharacterProps {
  message: string;
  mood?: 'friendly' | 'encouraging' | 'thinking' | 'congratulating';
  isTyping?: boolean;
}

export default function AviatorCharacter({
  message,
  mood = 'friendly',
  isTyping = false,
}: AviatorCharacterProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [typedMessage, setTypedMessage] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const bounceAnim = new Animated.Value(0);
  const fadeAnim = new Animated.Value(0);

  // Typing effect
  useEffect(() => {
    if (isTyping) {
      setTypedMessage('');
      setCurrentIndex(0);
    } else {
      setTypedMessage(message);
      setCurrentIndex(message.length);
    }
  }, [message, isTyping]);

  useEffect(() => {
    if (isTyping && currentIndex < message.length) {
      const timeout = setTimeout(() => {
        setTypedMessage(message.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, message, isTyping]);

  // Animations
  useEffect(() => {
    // Bounce animation for avatar
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const getMoodIcon = () => {
    const iconProps = {
      size: 40,
      color: colors.primaryForeground,
    };

    switch (mood) {
      case 'encouraging':
        return <MaterialIcons name="thumb-up" {...iconProps} />;
      case 'thinking':
        return <MaterialIcons name="psychology" {...iconProps} />;
      case 'congratulating':
        return <MaterialIcons name="celebration" {...iconProps} />;
      default:
        return <MaterialIcons name="waving-hand" {...iconProps} />;
    }
  };

  const getMoodColor = () => {
    switch (mood) {
      case 'encouraging':
        return colors.success;
      case 'thinking':
        return colors.info;
      case 'congratulating':
        return colors.warning;
      default:
        return colors.primary;
    }
  };

  const containerStyle: ViewStyle = {
    alignItems: 'center',
    marginVertical: Spacing.lg,
  };

  const avatarContainerStyle: ViewStyle = {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.full,
    backgroundColor: getMoodColor(),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  };

  const speechBubbleStyle: ViewStyle = {
    backgroundColor: colors.card,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.md,
    maxWidth: '90%',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  };

  const speechBubbleTriangleStyle: ViewStyle = {
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderTopWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.card,
    alignSelf: 'center',
    marginTop: -1,
  };

  const nameStyle: TextStyle = {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: colors.primary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  };

  const messageStyle: TextStyle = {
    fontSize: FontSizes.base,
    lineHeight: 24,
    color: colors.cardForeground,
    textAlign: 'center',
  };

  const typingIndicatorStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xs,
  };

  const TypingDot = ({ delay }: { delay: number }) => {
    const dotAnim = new Animated.Value(0);

    useEffect(() => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dotAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dotAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, []);

    return (
      <Animated.View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: colors.mutedForeground,
          marginHorizontal: 2,
          opacity: dotAnim,
        }}
      />
    );
  };

  return (
    <Animated.View style={[containerStyle, { opacity: fadeAnim }]}>
      {/* Avatar */}
      <Animated.View
        style={[
          avatarContainerStyle,
          {
            transform: [{ translateY: bounceAnim }],
          },
        ]}
      >
        {getMoodIcon()}
      </Animated.View>

      {/* Captain Sky Label */}
      <Text style={nameStyle}>Captain Sky</Text>

      {/* Speech Bubble */}
      <View style={speechBubbleStyle}>
        <Text style={messageStyle}>
          {isTyping ? typedMessage : message}
          {isTyping && currentIndex < message.length && (
            <Text style={{ color: colors.primary }}>|</Text>
          )}
        </Text>

        {isTyping && currentIndex >= message.length && (
          <View style={typingIndicatorStyle}>
            <TypingDot delay={0} />
            <TypingDot delay={150} />
            <TypingDot delay={300} />
          </View>
        )}
      </View>

      {/* Speech Bubble Triangle */}
      <View style={speechBubbleTriangleStyle} />
    </Animated.View>
  );
}
