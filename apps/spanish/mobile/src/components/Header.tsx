import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Header() {
  return (
    <View className="flex-row items-center justify-between px-4 pt-6">
      <View className="flex-row items-center gap-3">
        <View className="h-9 w-9 rounded-full bg-brand-primary/10 items-center justify-center">
          <Ionicons name="chatbubble-ellipses" size={18} color="#0EA5E9" />
        </View>
        <View>
          <Text className="text-brand font-semibold">talkAI</Text>
          <Text className="text-xs text-gray-500">Your mental health companion</Text>
        </View>
      </View>
      <View className="flex-row items-center gap-4">
        <View className="relative">
          <Ionicons name="notifications-outline" size={22} color="#111827" />
          <View className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-red-500 items-center justify-center">
            <Text className="text-[10px] text-white">2</Text>
          </View>
        </View>
        <View className="h-8 w-8 rounded-full bg-gray-900 items-center justify-center">
          <Text className="text-white text-xs">A</Text>
        </View>
      </View>
    </View>
  );
}
