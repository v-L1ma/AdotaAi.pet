/**
 * Base URL for the backend API.
 * - Android emulator: http://10.0.2.2:8080
 * - iOS simulator:    http://localhost:8080
 * - Physical device:  http://<your-machine-ip>:8080
 *
 * Override by setting the EXPO_PUBLIC_API_URL environment variable.
 */
export const API_URL: string =
  process.env.EXPO_PUBLIC_API_URL ?? "http://10.0.2.2:8080";
