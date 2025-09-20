import { View, Text, Button } from "react-native";
import { Link } from "expo-router";

export default function OnboardingStep3() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-2xl font-semibold text-gray-900 mb-3">All set!</Text>
      <Text className="text-center text-gray-600 mb-6">You\'re ready to start using talkAI.</Text>
      <Link href="/(tabs)" asChild>
        <Button title="Go to app" onPress={() => {}} />
      </Link>
    </View>
  );
}
