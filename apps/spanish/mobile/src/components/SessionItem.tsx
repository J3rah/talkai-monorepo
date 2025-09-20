import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SessionItem() {
  return (
    <View className="mx-4 mb-3 rounded-2xl bg-gray-900 px-4 py-3">
      <View className="flex-row items-center gap-2 mb-1">
        <Ionicons name="chatbubble-ellipses-outline" size={14} color="#94a3b8" />
        <Text className="text-white/90 text-sm">1/19/2024</Text>
        <Text className="text-white/50 text-xs">30 min</Text>
        <View className="ml-auto rounded-md bg-blue-100 px-2 py-0.5"><Text className="text-xs text-blue-700">good</Text></View>
      </View>
    </View>
  );
}
