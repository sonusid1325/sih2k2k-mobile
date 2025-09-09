import React from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ViewStyle,
  TextStyle,
} from "react-native";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import {
  Colors,
  Spacing,
  FontSizes,
  FontWeights,
  BorderRadius,
} from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import Button from "@/components/ui/Button";
import Card, { CardContent } from "@/components/ui/Card";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const handleStartAssessment = () => {
    router.push("/career-quiz");
  };

  const features = [
    {
      icon: "flight" as const,
      title: "AI Career Guide",
      description: "Get personalized guidance from Captain Sky",
    },
    {
      icon: "quiz" as const,
      title: "Smart Assessment",
      description: "Answer questions tailored to your interests",
    },
    {
      icon: "analytics" as const,
      title: "Career Insights",
      description: "Discover careers that match your profile",
    },
  ];

  // Styles
  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: colors.background,
  };

  const headerStyle: ViewStyle = {
    paddingHorizontal: Spacing.lg,
    paddingTop: StatusBar.currentHeight || Spacing.lg,
    paddingBottom: Spacing.xl,
    alignItems: "center",
  };

  const logoContainerStyle: ViewStyle = {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  };

  const titleStyle: TextStyle = {
    fontSize: FontSizes["3xl"],
    fontWeight: FontWeights.bold,
    color: colors.foreground,
    marginBottom: Spacing.xs,
  };

  const subtitleStyle: TextStyle = {
    fontSize: FontSizes.base,
    color: colors.mutedForeground,
    textAlign: "center",
    lineHeight: 24,
  };

  const sectionStyle: ViewStyle = {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  };

  const sectionTitleStyle: TextStyle = {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    color: colors.foreground,
    marginBottom: Spacing.lg,
  };

  const featureStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  };

  const featureIconStyle: ViewStyle = {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  };

  const featureContentStyle: ViewStyle = {
    flex: 1,
  };

  const featureTitleStyle: TextStyle = {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.medium,
    color: colors.foreground,
    marginBottom: 2,
  };

  const featureDescriptionStyle: TextStyle = {
    fontSize: FontSizes.sm,
    color: colors.mutedForeground,
    lineHeight: 20,
  };

  const ctaStyle: ViewStyle = {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  };

  const ctaTitleStyle: TextStyle = {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: colors.foreground,
    marginBottom: Spacing.sm,
  };

  const ctaDescriptionStyle: TextStyle = {
    fontSize: FontSizes.sm,
    color: colors.mutedForeground,
    marginBottom: Spacing.lg,
    lineHeight: 22,
  };

  return (
    <SafeAreaView style={containerStyle}>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={headerStyle}>
          <View style={logoContainerStyle}>
            <MaterialIcons
              name="flight-takeoff"
              size={36}
              color={colors.primaryForeground}
            />
          </View>
          <Text style={titleStyle}>SIH2k25</Text>
          <Text style={subtitleStyle}>
            Discover your perfect career path with AI-powered guidance
          </Text>
        </View>

        {/* Features */}
        <View style={sectionStyle}>
          <Text style={sectionTitleStyle}>How it works</Text>
          <Card>
            <CardContent style={{ padding: 0 }}>
              {features.map((feature, index) => (
                <View
                  key={index}
                  style={[
                    featureStyle,
                    index === features.length - 1 && { borderBottomWidth: 0 },
                  ]}
                >
                  <View style={featureIconStyle}>
                    <MaterialIcons
                      name={feature.icon}
                      size={20}
                      color={colors.primary}
                    />
                  </View>
                  <View style={featureContentStyle}>
                    <Text style={featureTitleStyle}>{feature.title}</Text>
                    <Text style={featureDescriptionStyle}>
                      {feature.description}
                    </Text>
                  </View>
                </View>
              ))}
            </CardContent>
          </Card>
        </View>

        {/* CTA */}
        <View style={ctaStyle}>
          <Text style={ctaTitleStyle}>Ready to get started?</Text>
          <Text style={ctaDescriptionStyle}>
            Take our career assessment and get personalized recommendations in
            just a few minutes.
          </Text>
          <Button onPress={handleStartAssessment} size="lg">
            Start Assessment
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
