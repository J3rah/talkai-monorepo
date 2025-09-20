import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AvailabilityPill() {
  return (
    <View className="mx-4 mt-4 rounded-xl border border-green-200 bg-green-50 py-3 items-center">
      <View className="flex-row items-center gap-2">
        <Ionicons name="ellipse" size={10} color="#16a34a" />
        <Text className="text-sm text-green-700">AI Therapist Available</Text>
      </View>
    </View>
  );
}
