import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  SafeAreaView,
  StatusBar,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/Theme';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Question, Answer, QuizSession } from '@/types/career';
import AviatorCharacter from '@/components/AviatorCharacter';
import MCQQuestion from '@/components/MCQQuestion';
import Button from '@/components/ui/Button';
import Progress from '@/components/ui/Progress';
import geminiService from '@/services/geminiService';

export default function CareerQuizScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // State
  const [quizSession, setQuizSession] = useState<QuizSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | undefined>();
  const [aviatorMessage, setAviatorMessage] = useState('');
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [aviatorMood, setAviatorMood] = useState<'friendly' | 'encouraging' | 'thinking' | 'congratulating'>('friendly');

  // Initialize quiz
  useEffect(() => {
    initializeQuiz();
  }, []);

  const initializeQuiz = async () => {
    try {
      setIsLoadingQuestions(true);
      setAviatorMood('friendly');

      // Get welcome message
      const welcomeMessage = await geminiService.generateAviatorMessage('welcome');
      setAviatorMessage(welcomeMessage);

      // Generate initial questions
      const initialQuestions = await geminiService.generateCareerQuestions([], 10);

      const newQuizSession: QuizSession = {
        id: `quiz_${Date.now()}`,
        questions: initialQuestions,
        answers: [],
        currentQuestionIndex: 0,
        isCompleted: false,
        startedAt: new Date(),
      };

      setQuizSession(newQuizSession);
      setCurrentQuestion(initialQuestions[0]);

    } catch (error) {
      console.error('Error initializing quiz:', error);
      Alert.alert(
        'Error',
        'Unable to load career assessment questions. Please check your internet connection and try again.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handleOptionSelect = async (optionIndex: number) => {
    if (!quizSession || !currentQuestion || isSubmittingAnswer) return;

    setSelectedOption(optionIndex);
    setIsSubmittingAnswer(true);

    try {
      // Create answer
      const answer: Answer = {
        questionId: currentQuestion.id,
        selectedOption: optionIndex,
        category: currentQuestion.category,
      };

      const updatedAnswers = [...quizSession.answers, answer];
      const nextQuestionIndex = quizSession.currentQuestionIndex + 1;
      const isQuizCompleted = nextQuestionIndex >= quizSession.questions.length;

      // Update quiz session
      const updatedSession: QuizSession = {
        ...quizSession,
        answers: updatedAnswers,
        currentQuestionIndex: nextQuestionIndex,
        isCompleted: isQuizCompleted,
        completedAt: isQuizCompleted ? new Date() : undefined,
      };

      setQuizSession(updatedSession);

      if (isQuizCompleted) {
        // Quiz completed
        setAviatorMood('congratulating');
        const completionMessage = await geminiService.generateAviatorMessage('completion');
        setAviatorMessage(completionMessage);
        setCurrentQuestion(null);

        // Navigate to results after a short delay
        setTimeout(() => {
          router.push({
            pathname: '/quiz-results',
            params: { answers: JSON.stringify(updatedAnswers) },
          });
        }, 3000);

      } else {
        // Move to next question
        const nextQuestion = quizSession.questions[nextQuestionIndex];
        setCurrentQuestion(nextQuestion);
        setSelectedOption(undefined);

        // Get encouragement message
        setAviatorMood('encouraging');
        const encouragementMessage = await geminiService.generateAviatorMessage(
          'question',
          nextQuestionIndex + 1
        );
        setAviatorMessage(encouragementMessage);
      }

    } catch (error) {
      console.error('Error processing answer:', error);
      Alert.alert('Error', 'Unable to process your answer. Please try again.');
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const handleBackPress = () => {
    Alert.alert(
      'Leave Assessment?',
      'Your progress will be lost if you leave now. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Leave', style: 'destructive', onPress: () => router.back() },
      ]
    );
  };

  const getProgressPercentage = (): number => {
    if (!quizSession) return 0;
    return (quizSession.currentQuestionIndex / quizSession.questions.length) * 100;
  };

  // Styles
  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: colors.background,
  };

  const headerStyle: ViewStyle = {
    paddingHorizontal: Spacing.md,
    paddingTop: StatusBar.currentHeight || Spacing.lg,
    paddingBottom: Spacing.md,
  };

  const headerContentStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const titleStyle: TextStyle = {
    fontSize: FontSizes['2xl'],
    fontWeight: FontWeights.bold,
    color: colors.foreground,
  };

  const progressContainerStyle: ViewStyle = {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  };

  const progressTextStyle: TextStyle = {
    fontSize: FontSizes.sm,
    color: colors.mutedForeground,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  };

  const contentStyle: ViewStyle = {
    flex: 1,
  };

  const loadingContainerStyle: ViewStyle = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  };

  const loadingTextStyle: TextStyle = {
    fontSize: FontSizes.lg,
    color: colors.mutedForeground,
    textAlign: 'center',
    marginTop: Spacing.md,
  };

  const completionContainerStyle: ViewStyle = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  };

  const completionTextStyle: TextStyle = {
    fontSize: FontSizes.lg,
    color: colors.foreground,
    textAlign: 'center',
    marginTop: Spacing.md,
  };

  return (
    <SafeAreaView style={containerStyle}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

      <LinearGradient
        colors={[colors.accent, colors.background]}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={headerStyle}>
          <View style={headerContentStyle}>
            <Button
              variant="ghost"
              size="sm"
              onPress={handleBackPress}
            >
              <MaterialIcons name="arrow-back" size={24} color={colors.foreground} />
            </Button>
            <Text style={titleStyle}>Career Assessment</Text>
            <View style={{ width: 40 }} />
          </View>
        </View>

        {/* Progress */}
        {quizSession && !quizSession.isCompleted && (
          <View style={progressContainerStyle}>
            <Text style={progressTextStyle}>
              Progress: {quizSession.currentQuestionIndex} / {quizSession.questions.length}
            </Text>
            <Progress value={getProgressPercentage()} height={6} />
          </View>
        )}

        {/* Content */}
        <ScrollView
          style={contentStyle}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Aviator Character */}
          <AviatorCharacter
            message={aviatorMessage}
            mood={aviatorMood}
            isTyping={isLoadingQuestions}
          />

          {/* Loading State */}
          {isLoadingQuestions && (
            <View style={loadingContainerStyle}>
              <Text style={loadingTextStyle}>
                Preparing your personalized career assessment...
              </Text>
            </View>
          )}

          {/* Quiz Completed State */}
          {quizSession?.isCompleted && (
            <View style={completionContainerStyle}>
              <MaterialIcons
                name="emoji-events"
                size={80}
                color={colors.warning}
              />
              <Text style={completionTextStyle}>
                Generating your personalized career recommendations...
              </Text>
            </View>
          )}

          {/* Current Question */}
          {currentQuestion && !isLoadingQuestions && !quizSession?.isCompleted && (
            <MCQQuestion
              question={currentQuestion.question}
              options={currentQuestion.options}
              selectedOption={selectedOption}
              onSelect={handleOptionSelect}
              questionNumber={quizSession!.currentQuestionIndex + 1}
              totalQuestions={quizSession!.questions.length}
              disabled={isSubmittingAnswer}
            />
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}
