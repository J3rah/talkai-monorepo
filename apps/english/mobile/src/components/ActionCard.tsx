import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = { icon: keyof typeof Ionicons.glyphMap; title: string; subtitle: string };
export default function ActionCard({ icon, title, subtitle }: Props) {
  return (
    <TouchableOpacity activeOpacity={0.8} className="flex-1 rounded-2xl bg-gray-900 p-4">
      <View className="h-10 w-10 rounded-xl bg-white/10 items-center justify-center mb-3">
        <Ionicons name={icon} size={22} color="#60A5FA" />
      </View>
      <Text className="text-white/80 text-sm mb-1">{title}</Text>
      <Text className="text-white/50 text-xs">{subtitle}</Text>
    </TouchableOpacity>
  );
}
