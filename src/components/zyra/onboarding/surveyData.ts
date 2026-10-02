export type SurveyOption = { label: string; value: string };

export type SurveyQuestion = {
  id: string;
  emoji?: string;
  title: string;
  subtitle?: string;
  type: "single" | "multi";
  required?: boolean;
  options: SurveyOption[];
};

export const surveyQuestions: SurveyQuestion[] = [
  {
    id: "goal",
    emoji: "🎯",
    title: "What's your main goal?",
    subtitle: "We'll tailor your plan around this.",
    type: "single",
    required: true,
    options: [
      { label: "Lose weight", value: "lose_weight" },
      { label: "Maintain weight", value: "maintain" },
      { label: "Gain muscle", value: "gain_muscle" },
      { label: "Eat healthier", value: "eat_healthier" },
    ],
  },
  {
    id: "activity",
    emoji: "🏃",
    title: "How active are you?",
    type: "single",
    required: true,
    options: [
      { label: "Sedentary", value: "sedentary" },
      { label: "Lightly active", value: "light" },
      { label: "Moderately active", value: "moderate" },
      { label: "Very active", value: "very_active" },
    ],
  },
  {
    id: "diet",
    emoji: "🥗",
    title: "Any dietary preferences?",
    subtitle: "Select all that apply.",
    type: "multi",
    required: false,
    options: [
      { label: "Vegetarian", value: "vegetarian" },
      { label: "Vegan", value: "vegan" },
      { label: "Low carb", value: "low_carb" },
      { label: "None", value: "none" },
    ],
  },
  {
    id: "barriers",
    emoji: "🚧",
    title: "What's held you back before?",
    type: "multi",
    required: false,
    options: [
      { label: "Lack of time", value: "time" },
      { label: "Inconsistent tracking", value: "tracking" },
      { label: "Lack of motivation", value: "motivation" },
      { label: "Not sure what to eat", value: "knowledge" },
    ],
  },
];
