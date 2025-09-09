import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  ViewStyle,
  TextStyle,
  Dimensions,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/Theme';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Answer, CareerRecommendation, CareerProfile } from '@/types/career';
import AviatorCharacter from '@/components/AviatorCharacter';
import Button from '@/components/ui/Button';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Progress from '@/components/ui/Progress';
import geminiService from '@/services/geminiService';

const { width } = Dimensions.get('window');

export default function QuizResultsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const params = useLocalSearchParams();

  // State
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aviatorMessage, setAviatorMessage] = useState('');
  const [selectedRecommendation, setSelectedRecommendation] = useState<CareerRecommendation | null>(null);

  useEffect(() => {
    if (params.answers) {
      try {
        const parsedAnswers = JSON.parse(params.answers as string) as Answer[];
        setAnswers(parsedAnswers);
        generateRecommendations(parsedAnswers);
      } catch (error) {
        console.error('Error parsing answers:', error);
        Alert.alert('Error', 'Unable to process assessment results.');
        router.back();
      }
    }
  }, [params.answers]);

  const generateRecommendations = async (userAnswers: Answer[]) => {
    try {
      setIsLoading(true);

      // Generate career recommendations
      const careerRecommendations = await geminiService.generateCareerRecommendations(userAnswers);
      setRecommendations(careerRecommendations);

      // Get aviator message for results
      const resultsMessage = await geminiService.generateAviatorMessage('completion');
      setAviatorMessage(resultsMessage);

    } catch (error) {
      console.error('Error generating recommendations:', error);
      Alert.alert('Error', 'Unable to generate career recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecommendationPress = (recommendation: CareerRecommendation) => {
    setSelectedRecommendation(recommendation);
  };

  const handleStartOver = () => {
    Alert.alert(
      'Start New Assessment',
      'Are you sure you want to start a new career assessment?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start Over', onPress: () => router.replace('/career-quiz') },
      ]
    );
  };

  const handleShareResults = () => {
    // TODO: Implement sharing functionality
    Alert.alert('Share Results', 'Sharing functionality coming soon!');
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: string } = {
      aviation: 'flight',
      technology: 'computer',
      healthcare: 'local-hospital',
      business: 'business',
      creative: 'palette',
      engineering: 'engineering',
      education: 'school',
      science: 'science',
      social_services: 'people',
      sports: 'sports',
    };
    return iconMap[category] || 'work';
  };

  const RecommendationCard = ({ recommendation, index }: {
    recommendation: CareerRecommendation;
    index: number;
  }) => (
    <Card
      key={recommendation.title}
      style={{
        marginBottom: Spacing.md,
        marginHorizontal: Spacing.md,
      }}
    >
      <CardContent>
        <View style={recommendationHeaderStyle}>
          <View style={iconContainerStyle(recommendation.category)}>
            <MaterialIcons
              name={getCategoryIcon(recommendation.category) as any}
              size={32}
              color={colors.primaryForeground}
            />
          </View>
          <View style={{ flex: 1, marginLeft: Spacing.md }}>
            <Text style={recommendationTitleStyle}>
              {recommendation.title}
            </Text>
            <View style={matchPercentageContainerStyle}>
              <Text style={matchPercentageTextStyle}>
                {recommendation.matchPercentage}% Match
              </Text>
              <Progress
                value={recommendation.matchPercentage}
                style={{ marginTop: Spacing.xs }}
                height={4}
              />
            </View>
          </View>
        </View>

        <Text style={recommendationDescriptionStyle}>
          {recommendation.description}
        </Text>

        {recommendation.averageSalary && (
          <View style={salaryContainerStyle}>
            <MaterialIcons name="attach-money" size={16} color={colors.success} />
            <Text style={salaryTextStyle}>
              {recommendation.averageSalary}
            </Text>
          </View>
        )}

        <View style={skillsContainerStyle}>
          <Text style={sectionTitleStyle}>Required Skills:</Text>
          <View style={skillsListStyle}>
            {recommendation.requiredSkills.map((skill, skillIndex) => (
              <View key={skillIndex} style={skillTagStyle}>
                <Text style={skillTagTextStyle}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={educationContainerStyle}>
          <Text style={sectionTitleStyle}>Education Path:</Text>
          {recommendation.educationPath.map((step, stepIndex) => (
            <View key={stepIndex} style={educationStepStyle}>
              <MaterialIcons name="school" size={16} color={colors.info} />
              <Text style={educationStepTextStyle}>{step}</Text>
            </View>
          ))}
        </View>

        <View style={outlookContainerStyle}>
          <MaterialIcons name="trending-up" size={16} color={colors.warning} />
          <Text style={outlookTextStyle}>
            <Text style={{ fontWeight: FontWeights.semibold }}>Job Outlook: </Text>
            {recommendation.jobOutlook}
          </Text>
        </View>

        <Button
          onPress={() => handleRecommendationPress(recommendation)}
          style={{ marginTop: Spacing.md }}
          size="sm"
        >
          Learn More
        </Button>
      </CardContent>
    </Card>
  );

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

  const titleStyle: TextStyle = {
    fontSize: FontSizes['2xl'],
    fontWeight: FontWeights.bold,
    color: colors.foreground,
    textAlign: 'center',
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

  const resultsContainerStyle: ViewStyle = {
    paddingBottom: Spacing.xxl,
  };

  const sectionHeaderStyle: ViewStyle = {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  };

  const sectionTitleLargeStyle: TextStyle = {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: colors.foreground,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  };

  const sectionSubtitleStyle: TextStyle = {
    fontSize: FontSizes.base,
    color: colors.mutedForeground,
    textAlign: 'center',
  };

  const recommendationHeaderStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  };

  const iconContainerStyle = (category: string): ViewStyle => ({
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  });

  const recommendationTitleStyle: TextStyle = {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: colors.foreground,
    marginBottom: Spacing.xs,
  };

  const matchPercentageContainerStyle: ViewStyle = {
    flex: 1,
  };

  const matchPercentageTextStyle: TextStyle = {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: colors.primary,
  };

  const recommendationDescriptionStyle: TextStyle = {
    fontSize: FontSizes.base,
    color: colors.mutedForeground,
    lineHeight: 24,
    marginBottom: Spacing.md,
  };

  const salaryContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  };

  const salaryTextStyle: TextStyle = {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
    color: colors.success,
    marginLeft: Spacing.xs,
  };

  const skillsContainerStyle: ViewStyle = {
    marginBottom: Spacing.md,
  };

  const sectionTitleStyle: TextStyle = {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
    color: colors.foreground,
    marginBottom: Spacing.xs,
  };

  const skillsListStyle: ViewStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  };

  const skillTagStyle: ViewStyle = {
    backgroundColor: colors.accent,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: colors.primary,
  };

  const skillTagTextStyle: TextStyle = {
    fontSize: FontSizes.xs,
    color: colors.accentForeground,
    fontWeight: FontWeights.medium,
  };

  const educationContainerStyle: ViewStyle = {
    marginBottom: Spacing.md,
  };

  const educationStepStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  };

  const educationStepTextStyle: TextStyle = {
    fontSize: FontSizes.sm,
    color: colors.foreground,
    marginLeft: Spacing.xs,
    flex: 1,
  };

  const outlookContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  };

  const outlookTextStyle: TextStyle = {
    fontSize: FontSizes.sm,
    color: colors.foreground,
    marginLeft: Spacing.xs,
    flex: 1,
    lineHeight: 20,
  };

  const actionsContainerStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
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
          <Text style={titleStyle}>Your Career Recommendations</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* Aviator Character */}
          <AviatorCharacter
            message={aviatorMessage || "Here are your personalized career recommendations based on your assessment!"}
            mood="congratulating"
            isTyping={isLoading}
          />

          {/* Loading State */}
          {isLoading && (
            <View style={loadingContainerStyle}>
              <MaterialIcons name="psychology" size={64} color={colors.primary} />
              <Text style={loadingTextStyle}>
                Analyzing your responses and generating personalized recommendations...
              </Text>
            </View>
          )}

          {/* Results */}
          {!isLoading && recommendations.length > 0 && (
            <View style={resultsContainerStyle}>
              <View style={sectionHeaderStyle}>
                <Text style={sectionTitleLargeStyle}>
                  Perfect Career Matches
                </Text>
                <Text style={sectionSubtitleStyle}>
                  Based on your interests and aptitudes
                </Text>
              </View>

              {recommendations.map((recommendation, index) => (
                <RecommendationCard
                  key={recommendation.title}
                  recommendation={recommendation}
                  index={index}
                />
              ))}
            </View>
          )}

          {/* No results */}
          {!isLoading && recommendations.length === 0 && (
            <View style={loadingContainerStyle}>
              <MaterialIcons name="sentiment-dissatisfied" size={64} color={colors.mutedForeground} />
              <Text style={loadingTextStyle}>
                Unable to generate recommendations. Please try taking the assessment again.
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Action Buttons */}
        {!isLoading && (
          <View style={actionsContainerStyle}>
            <Button
              variant="outline"
              onPress={handleStartOver}
              style={{ flex: 1 }}
            >
              Start Over
            </Button>
            <Button
              onPress={handleShareResults}
              style={{ flex: 1 }}
            >
              Share Results
            </Button>
          </View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}
