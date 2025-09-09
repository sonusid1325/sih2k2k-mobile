import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/Theme';
import { useColorScheme } from '@/hooks/useColorScheme';
import Card from './ui/Card';

interface MCQQuestionProps {
  question: string;
  options: string[];
  selectedOption?: number;
  onSelect: (optionIndex: number) => void;
  questionNumber: number;
  totalQuestions: number;
  disabled?: boolean;
}

export default function MCQQuestion({
  question,
  options,
  selectedOption,
  onSelect,
  questionNumber,
  totalQuestions,
  disabled = false,
}: MCQQuestionProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [animatedValues] = useState(
    options.map(() => new Animated.Value(0))
  );
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    // Animate question entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate options with stagger effect
    const animations = animatedValues.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      })
    );

    Animated.stagger(100, animations).start();
  }, []);

  const handleOptionSelect = (index: number) => {
    if (disabled) return;

    // Animate selection
    const otherAnims = animatedValues
      .filter((_, i) => i !== index)
      .map(anim =>
        Animated.timing(anim, {
          toValue: 0.7,
          duration: 200,
          useNativeDriver: true,
        })
      );

    const selectedAnim = Animated.sequence([
      Animated.timing(animatedValues[index], {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValues[index], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]);

    Animated.parallel([selectedAnim, ...otherAnims]).start();

    setTimeout(() => onSelect(index), 300);
  };

  const getOptionStyle = (index: number): ViewStyle => {
    const isSelected = selectedOption === index;

    return {
      backgroundColor: isSelected ? colors.primary : colors.card,
      borderColor: isSelected ? colors.primary : colors.border,
      borderWidth: 2,
      borderRadius: BorderRadius.lg,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      marginVertical: Spacing.xs,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isSelected ? 0.2 : 0.1,
      shadowRadius: 4,
      elevation: isSelected ? 6 : 2,
      opacity: disabled && !isSelected ? 0.5 : 1,
    };
  };

  const getOptionTextStyle = (index: number): TextStyle => {
    const isSelected = selectedOption === index;

    return {
      fontSize: FontSizes.base,
      fontWeight: isSelected ? FontWeights.semibold : FontWeights.normal,
      color: isSelected ? colors.primaryForeground : colors.cardForeground,
      flex: 1,
      marginRight: Spacing.sm,
    };
  };

  const containerStyle: ViewStyle = {
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.lg,
  };

  const headerStyle: ViewStyle = {
    marginBottom: Spacing.lg,
    alignItems: 'center',
  };

  const questionNumberStyle: TextStyle = {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: colors.mutedForeground,
    marginBottom: Spacing.xs,
  };

  const questionTextStyle: TextStyle = {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    color: colors.foreground,
    textAlign: 'center',
    lineHeight: 28,
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <Animated.View
      style={[
        containerStyle,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* Question Header */}
      <View style={headerStyle}>
        <Text style={questionNumberStyle}>
          Question {questionNumber} of {totalQuestions}
        </Text>
        <Text style={questionTextStyle}>{question}</Text>
      </View>

      {/* Options */}
      <View>
        {options.map((option, index) => (
          <Animated.View
            key={index}
            style={[
              {
                opacity: animatedValues[index],
                transform: [
                  {
                    scale: animatedValues[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity
              style={getOptionStyle(index)}
              onPress={() => handleOptionSelect(index)}
              activeOpacity={0.8}
              disabled={disabled}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: BorderRadius.full,
                    backgroundColor: selectedOption === index
                      ? colors.primaryForeground
                      : colors.primary,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: Spacing.md,
                  }}
                >
                  <Text
                    style={{
                      fontSize: FontSizes.sm,
                      fontWeight: FontWeights.semibold,
                      color: selectedOption === index
                        ? colors.primary
                        : colors.primaryForeground,
                    }}
                  >
                    {optionLetters[index]}
                  </Text>
                </View>
                <Text style={getOptionTextStyle(index)}>{option}</Text>
              </View>

              {selectedOption === index && (
                <MaterialIcons
                  name="check-circle"
                  size={24}
                  color={colors.primaryForeground}
                />
              )}
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );
}
