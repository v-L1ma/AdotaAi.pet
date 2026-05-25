import { compressAvatarImage, compressMultipleImages, validateCompressedSize } from "../services/imageCompressionService";
import { UpdateProfilePictureInput } from "./useUpdateProfilePicture";

/**
 * Utility functions for image handling and compression across the app
 */

/**
 * Format bytes to human-readable file size
 * @param bytes - Size in bytes
 * @returns Formatted string (e.g., "2.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Calculate compression percentage
 * @param original - Original size in bytes
 * @param compressed - Compressed size in bytes
 * @returns Compression percentage
 */
export function calculateCompressionPercentage(original: number, compressed: number): number {
  if (original === 0) return 0;
  return ((original - compressed) / original) * 100;
}

/**
 * Prepare image for upload by compressing it
 * Follows best practices:
 * - Compresses before upload
 * - Strips metadata
 * - Maintains aspect ratio
 *
 * @param imageUri - URI of the image to compress
 * @param originalSize - Original file size (optional)
 * @returns UpdateProfilePictureInput ready for upload
 */
export async function prepareImageForUpload(
  imageUri: string,
  originalSize?: number
): Promise<UpdateProfilePictureInput> {
  try {
    const compressionResult = await compressAvatarImage(imageUri, originalSize);

    return {
      uri: compressionResult.uri,
      fileName: compressionResult.fileName,
      mimeType: compressionResult.mimeType,
      fileSize: compressionResult.compressedSize,
    };
  } catch (error) {
    console.error("Failed to prepare image for upload:", error);
    // Fallback to original image if compression fails
    return {
      uri: imageUri,
      fileSize: originalSize,
    };
  }
}

/**
 * Validate and prepare multiple images for batch upload
 * Useful for pet listings and event galleries
 *
 * @param imageUris - Array of image URIs
 * @returns Array of compressed images ready for upload
 */
export async function prepareImagesForBatchUpload(imageUris: string[]): Promise<UpdateProfilePictureInput[]> {
  try {
    const compressionResults = await compressMultipleImages(imageUris);

    return compressionResults.map((result) => ({
      uri: result.uri,
      fileName: result.fileName,
      mimeType: result.mimeType,
      fileSize: result.compressedSize,
    }));
  } catch (error) {
    console.error("Failed to prepare images for batch upload:", error);
    // Fallback to original images if batch compression fails
    return imageUris.map((uri) => ({
      uri,
    }));
  }
}

/**
 * Check if an image needs compression based on size
 * @param fileSizeBytes - File size in bytes
 * @param thresholdKB - Compression threshold in KB (default: 100)
 * @returns true if image should be compressed
 */
export function shouldCompressImage(fileSizeBytes: number, thresholdKB: number = 100): boolean {
  return fileSizeBytes > thresholdKB * 1024;
}

/**
 * Estimate if image will meet size requirements after compression
 * Uses heuristic based on typical compression ratios
 *
 * @param originalSizeBytes - Original file size in bytes
 * @param targetSizeKB - Target size in KB
 * @returns Estimated success probability (0-1)
 */
export function estimateCompressionSuccess(originalSizeBytes: number, targetSizeKB: number = 50): number {
  // Typical compression ratios for images:
  // - High quality: 40-50% reduction
  // - Medium quality (0.8): 60-70% reduction  
  // - Low quality: 80-90% reduction
  const typicalCompressionRatio = 0.65; // ~65% reduction at quality 0.8
  const estimatedCompressedSize = originalSizeBytes * (1 - typicalCompressionRatio);
  const targetSizeBytes = targetSizeKB * 1024;

  if (estimatedCompressedSize <= targetSizeBytes) {
    return 1.0; // High confidence
  } else if (estimatedCompressedSize <= targetSizeBytes * 1.2) {
    return 0.7; // Medium confidence (20% overage)
  } else if (estimatedCompressedSize <= targetSizeBytes * 1.5) {
    return 0.3; // Low confidence (50% overage)
  } else {
    return 0.0; // Very unlikely to meet target
  }
}

/**
 * Get recommended compression message for users
 * @param originalSizeKB - Original size in KB
 * @param compressedSizeKB - Compressed size in KB
 * @returns User-friendly message
 */
export function getCompressionMessage(originalSizeKB: number, compressedSizeKB: number): string {
  const reduction = ((originalSizeKB - compressedSizeKB) / originalSizeKB) * 100;
  return `Imagem comprimida: ${formatFileSize(compressedSizeKB * 1024)} (${reduction.toFixed(0)}% menor)`;
}

export default {
  formatFileSize,
  calculateCompressionPercentage,
  prepareImageForUpload,
  prepareImagesForBatchUpload,
  shouldCompressImage,
  estimateCompressionSuccess,
  getCompressionMessage,
};
