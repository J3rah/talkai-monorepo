import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = { icon: keyof typeof Ionicons.glyphMap; value: string; label: string };
export default function StatCard({ icon, value, label }: Props) {
  return (
    <View className="flex-1 rounded-2xl bg-white/80 p-4 shadow-sm">
      <View className="h-8 w-8 rounded-lg bg-white items-center justify-center mb-2">
        <Ionicons name={icon} size={18} color="#0EA5E9" />
      </View>
      <Text className="text-2xl font-semibold text-gray-900">{value}</Text>
      <Text className="text-xs text-gray-500">{label}</Text>
    </View>
  );
}
