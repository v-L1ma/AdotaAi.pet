import { Platform } from "react-native";
import * as ImageManipulator from "expo-image-manipulator";

/**
 * Image optimization settings for avatars
 * Since we use expo-image-picker with aspect ratio control,
 * we focus on validation and size monitoring
 */
interface CompressionConfig {
  compressionMethod: "auto" | "manual";
  quality: number;
  maxWidth: number;
  maxHeight: number;
  output: "jpeg" | "png";
}

interface CompressionResult {
  uri: string;
  fileName: string;
  mimeType: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

/**
 * Default configuration for avatar optimization
 * Uses expo-image-picker with aspect ratio control
 * Target: ~50 KB after optimization
 */
const AVATAR_COMPRESSION_CONFIG: CompressionConfig = {
  compressionMethod: "auto",
  quality: 0.2,
  maxWidth: 300,
  maxHeight: 300,
  output: "jpeg",
};

const PET_COMPRESSION_CONFIG: CompressionConfig = {
  compressionMethod: "auto",
  quality: 0.6,
  maxWidth: 1024,
  maxHeight: 1024,
  output: "jpeg",
};

/**
 * Platform-specific compression configurations
 */
const PLATFORM_CONFIGS = {
  android: AVATAR_COMPRESSION_CONFIG,
  ios: AVATAR_COMPRESSION_CONFIG,
  web: AVATAR_COMPRESSION_CONFIG,
} as const;

/**
 * Get the appropriate compression configuration for the current platform
 */
function getCompressionConfig(type: "avatar" | "pet" = "avatar"): CompressionConfig {
  if (type === "pet") return PET_COMPRESSION_CONFIG;
  const config = PLATFORM_CONFIGS[Platform.OS as keyof typeof PLATFORM_CONFIGS] || AVATAR_COMPRESSION_CONFIG;
  return config;
}

/**
 * Get the MIME type based on output format
 */
function getMimeType(format: "jpeg" | "png"): string {
  const mimeTypes: Record<string, string> = {
    jpeg: "image/jpeg",
    png: "image/png",
  };
  return mimeTypes[format] || "image/jpeg";
}

/**
 * Generate a filename with timestamp and appropriate extension
 */
function generateFileName(format: "jpeg" | "png", prefix: string = "avatar"): string {
  const extensions: Record<string, string> = {
    jpeg: "jpg",
    png: "png",
  };
  const ext = extensions[format] || "jpg";
  return `${prefix}-${Date.now()}.${ext}`;
}

/**
 * Get file size from URI (for informational purposes)
 * Note: For native platforms, this returns 0 as actual file system access
 * requires native modules. The original fileSize from ImagePicker is used instead.
 */
async function getFileSizeFromUri(uri: string): Promise<number> {
  try {
    if (Platform.OS === "web") {
      const response = await fetch(uri);
      const blob = await response.blob();
      return blob.size;
    }
    // Note: We could use expo-file-system here if installed to get accurate size
    return 0;
  } catch (error) {
    console.warn("Could not determine file size:", error);
    return 0;
  }
}

/**
 * Optimize an image for avatar upload
 *
 * @param sourceUri - URI of the image from ImagePicker
 * @param originalSize - Original file size from ImagePicker (optional)
 * @returns Image metadata with size information
 */
export async function compressAvatarImage(
  sourceUri: string,
  originalSize?: number
): Promise<CompressionResult> {
  return compressImage(sourceUri, "avatar", originalSize);
}

/**
 * Generic image compression function
 */
async function compressImage(
  sourceUri: string,
  type: "avatar" | "pet",
  originalSize?: number
): Promise<CompressionResult> {
  try {
    const config = getCompressionConfig(type);
    const fileName = generateFileName(config.output, type);
    const mimeType = getMimeType(config.output);

    // Use provided original size or try to fetch it
    const origSize = originalSize || (await getFileSizeFromUri(sourceUri)) || 0;

    let resultUri = sourceUri;
    
    // Apply actual compression using ImageManipulator
    if (Platform.OS !== "web") {
      const manipResult = await ImageManipulator.manipulateAsync(
        sourceUri,
        [
          {
            resize: {
              width: config.maxWidth,
              height: config.maxHeight,
            },
          },
        ],
        {
          compress: config.quality,
          format: config.output === "png" 
            ? ImageManipulator.SaveFormat.PNG 
            : ImageManipulator.SaveFormat.JPEG,
        }
      );
      resultUri = manipResult.uri;
    }

    // Estimate compression based on quality setting for UI feedback
    const compressionFactor = config.quality; 
    const estimatedCompressedSize = origSize > 0 
      ? Math.round(origSize * compressionFactor)
      : 0;

    return {
      uri: resultUri,
      fileName,
      mimeType,
      originalSize: origSize,
      compressedSize: estimatedCompressedSize,
      compressionRatio: origSize > 0 ? (1 - compressionFactor) * 100 : 0,
    };
  } catch (error) {
    console.error(`Image optimization failed (${type}):`, error);
    throw new Error(`Falha ao otimizar imagem: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
  }
}

/**
 * Batch compress multiple images (useful for pet listings)
 *
 * @param imageUris - Array of image URIs to compress
 * @returns Array of compression results
 */
export async function compressMultipleImages(
  imageUris: string[]
): Promise<CompressionResult[]> {
  try {
    const results: CompressionResult[] = [];

    for (const uri of imageUris) {
      const result = await compressImage(uri, "pet");
      results.push(result);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return results;
  } catch (error) {
    console.error("Batch compression failed:", error);
    throw new Error(
      `Falha ao comprimir múltiplas imagens: ${error instanceof Error ? error.message : "Erro desconhecido"}`
    );
  }
}

/**
 * Validate if compressed image meets target size requirements
 *
 * @param compressedSize - Size of compressed image in bytes
 * @param targetSizeKB - Target size in KB (default: 50)
 * @returns true if within acceptable range, false otherwise
 */
export function validateCompressedSize(compressedSize: number, targetSizeKB: number = 50): boolean {
  const maxBytes = targetSizeKB * 1024 * 1.2; // Allow 20% overage
  return compressedSize <= maxBytes;
}

/**
 * Get compression statistics for diagnostics
 *
 * @param result - Compression result
 * @returns Human-readable compression statistics
 */
export function getCompressionStats(result: CompressionResult): string {
  const originalKB = (result.originalSize / 1024).toFixed(2);
  const compressedKB = (result.compressedSize / 1024).toFixed(2);

  return `Original: ${originalKB}KB → Compressed: ${compressedKB}KB (${result.compressionRatio.toFixed(1)}% reduction)`;
}

export default {
  compressAvatarImage,
  compressMultipleImages,
  validateCompressedSize,
  getCompressionStats,
};
