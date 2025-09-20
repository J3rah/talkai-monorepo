import { View, Text, Button } from "react-native";
import { Link } from "expo-router";

export default function OnboardingStep1() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-2xl font-semibold text-gray-900 mb-3">Welcome to talkAI</Text>
      <Text className="text-center text-gray-600 mb-6">Let\'s get you set up in a few quick steps.</Text>
      <Link href="/onboarding/step2" asChild>
        <Button title="Next" onPress={() => {}} />
      </Link>
    </View>
  );
}
