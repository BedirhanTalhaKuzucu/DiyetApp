import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';

interface PhotoPickerProps {
  photoUri: string | undefined;
  onPhotoSelected: (uri: string) => void;
}

export const PhotoPicker: React.FC<PhotoPickerProps> = ({ photoUri, onPhotoSelected }) => {
  const { t } = useTranslation();

  const showPhotoOptions = () => {
    Alert.alert(
      t('meal.photoFrom'),
      '',
      [
        {
          text: t('meal.camera'),
          onPress: pickImageFromCamera,
        },
        {
          text: t('meal.gallery'),
          onPress: pickImageFromGallery,
        },
        {
          text: t('meal.cancel'),
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const pickImageFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('meal.cameraPermission'));
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      onPhotoSelected(result.assets[0].uri);
    }
  };

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('meal.galleryPermission'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      onPhotoSelected(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('meal.addPhoto')}</Text>
      <Pressable onPress={showPhotoOptions} style={styles.photoButton}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.photoPreview} />
        ) : (
          <View style={styles.placeholderContent}>
            <Ionicons name="camera-outline" size={32} color={theme.colors.textMuted} />
            <Text style={styles.placeholderText}>{t('meal.addPhoto')}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.md,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textDark,
    marginBottom: theme.spacing.xs,
  },
  photoButton: {
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#C7CE9E',
    borderStyle: 'dashed',
    backgroundColor: '#EEF2D3',
    overflow: 'hidden',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
});
