import React from 'react';
import { View, Text, Image, Pressable, ActivityIndicator, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Icon1 from 'react-native-vector-icons/Ionicons';
import { colors } from '@/styles/variables';

interface ImageUploaderProps {
  imageUri?: string;
  existingPhotoUrl?: string | null;
  onPress: () => void;
  isCompressing?: boolean;
  label?: string;
  circular?: boolean;
  size?: number | { width: number; height: number };
  style?: StyleProp<ViewStyle>;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageUri,
  existingPhotoUrl,
  onPress,
  isCompressing = false,
  label = "ADICIONAR FOTO",
  circular = true,
  size = 138,
  style
}) => {
  const width = typeof size === 'number' ? size : size.width;
  const height = typeof size === 'number' ? size : size.height;
  const borderRadius = circular ? (width / 2) : 20;

  return (
    <View style={[styles.container, style]}>
      <Pressable 
        style={[
          styles.avatarUploader, 
          { width, height, borderRadius }
        ]} 
        onPress={onPress} 
        disabled={isCompressing}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={[styles.avatarImage, { borderRadius }]} />
        ) : existingPhotoUrl ? (
          <Image source={{ uri: existingPhotoUrl }} style={[styles.avatarImage, { borderRadius }]} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Icon1 name="camera-outline" size={30} color="#8c8c8c" />
            <Text style={styles.avatarHint}>{label}</Text>
          </View>
        )}
        {isCompressing && (
          <View style={styles.avatarLoadingOverlay}>
            <ActivityIndicator size="small" color="#FFF" />
          </View>
        )}
      </Pressable>
      <Pressable 
        style={styles.avatarEditBadge}
        onPress={onPress} 
        disabled={isCompressing}>
        <Icon1 name="pencil" size={14} color="#fff" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 4,
  },
  avatarUploader: {
    backgroundColor: colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 4,
    borderColor: colors.surfaceLowest,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  avatarHint: {
    fontSize: 9,
    letterSpacing: 0.8,
    fontWeight: '800',
    color: '#8c8c8c',
  },
  avatarEditBadge: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
