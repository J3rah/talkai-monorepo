import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';

interface TalkAILogoProps {
  width?: number;
  height?: number;
  style?: any;
}

export default function TalkAILogo({ width = 120, height = 40, style }: TalkAILogoProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const logoSrc = isDark 
    ? require('../../assets/images/talkAI_white_letters.png')
    : require('../../assets/images/talkAI_dark_letters.png');

  return (
    <View style={[styles.container, style]}>
      <Image
        source={logoSrc}
        style={[styles.logo, { width, height }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    // Additional styling can be added here if needed
  },
});
