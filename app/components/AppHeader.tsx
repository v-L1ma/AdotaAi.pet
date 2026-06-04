import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import colors from '../styles/colors';

type AppHeaderProps = {
  title: string;
  onBackPress?: () => void;
  titleFontSize?: number;
  titleNumberOfLines?: number;
};

export default function AppHeader({ title, onBackPress, titleFontSize = 28, titleNumberOfLines = 1 }: AppHeaderProps) {
  const router = useRouter();

  return (
    <>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 150,
          backgroundColor: 'transparent',
          zIndex: 10,
          alignItems: 'center',
        }}
      >
        <View
            style={{
            width: '100%',
            backgroundColor: '#fff',
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            paddingTop: 54,
            paddingBottom: 18,
            shadowColor: '#000',
            shadowOpacity: 0.06,
            shadowRadius: 4,
            elevation: 2,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
          }}
        >
          <TouchableOpacity
            onPress={() => (onBackPress ? onBackPress() : router.back())}
            style={{ width: 34, height: 34, alignItems: 'center', justifyContent: 'center' }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={26} color={colors.primary} />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text
              numberOfLines={titleNumberOfLines}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
              style={{
                fontSize: titleFontSize,
                fontWeight: 'bold',
                color: '#e74c3c',
                textAlign: 'center',
                marginBottom: 0,
                includeFontPadding: false,
                lineHeight: titleFontSize + 2,
              }}
            >
              {title}
            </Text>
          </View>
          <View style={{ width: 34, height: 34 }} />
        </View>
      </View>
    </>
  );
}
