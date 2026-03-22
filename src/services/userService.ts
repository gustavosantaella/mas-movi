import * as SecureStore from 'expo-secure-store';
import NetInfo from '@react-native-community/netinfo';
import { API_BASE_URL } from '@/constants';

const PROFILE_CACHE_KEY = 'user_profile';

export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dni: string;
  sex: string;
  dateOfBirth: string;
  userType: number[];
  emailConfirmed: boolean;
  entityConfirmed: boolean;
  status: number;
  createdAt: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

/* ─── SecureStore cache helpers ───────────── */

export async function getCachedProfile(): Promise<UserProfile | null> {
  try {
    const raw = await SecureStore.getItemAsync(PROFILE_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function setCachedProfile(profile: UserProfile): Promise<void> {
  try {
    await SecureStore.setItemAsync(PROFILE_CACHE_KEY, JSON.stringify(profile));
  } catch {
    // Silent fail – non-critical
  }
}

export async function clearCachedProfile(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(PROFILE_CACHE_KEY);
  } catch {}
}

export async function isOnline(): Promise<boolean> {
  const state = await NetInfo.fetch();
  return !!(state.isConnected && state.isInternetReachable !== false);
}

/* ─── API functions ───────────────────────── */

/**
 * Fetches the authenticated user's profile.
 * Saves to SecureStore on success. Falls back to cache when offline.
 */
export async function getProfile(token: string): Promise<ApiResponse<UserProfile>> {
  const online = await isOnline();

  if (!online) {
    const cached = await getCachedProfile();
    if (cached) {
      return { success: true, message: 'Datos en caché.', data: cached };
    }
    throw new Error('Sin conexión y sin datos en caché.');
  }

  const response = await fetch(`${API_BASE_URL}/auth/user/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const data: ApiResponse<UserProfile> = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Error al obtener perfil.');
  }

  // Cache the result
  if (data.data) {
    await setCachedProfile(data.data);
  }

  return data;
}

/**
 * Updates user profile fields (firstName, lastName, dateOfBirth).
 * Also updates SecureStore cache.
 */
export async function updateProfile(
  token: string,
  fields: { firstName?: string; lastName?: string; dateOfBirth?: string },
): Promise<ApiResponse<UserProfile>> {
  const response = await fetch(`${API_BASE_URL}/auth/user/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(fields),
  });

  const data: ApiResponse<UserProfile> = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Error al actualizar perfil.');
  }

  // Update cache
  if (data.data) {
    await setCachedProfile(data.data);
  }

  return data;
}

/**
 * Confirms entity after successful OCR, also saves extracted OCR data.
 * Updates cache afterwards.
 */
export async function confirmEntity(
  token: string,
  ocrData: { dni?: string; firstName?: string; lastName?: string; dateOfBirth?: string; sex?: string },
): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/user/confirm-entity`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(ocrData),
  });

  const data: ApiResponse = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Error al confirmar entidad.');
  }

  // Update cache with new entity data
  const cached = await getCachedProfile();
  if (cached) {
    await setCachedProfile({
      ...cached,
      entityConfirmed: true,
      ...(ocrData.dni && { dni: ocrData.dni }),
      ...(ocrData.firstName && { firstName: ocrData.firstName }),
      ...(ocrData.lastName && { lastName: ocrData.lastName }),
      ...(ocrData.dateOfBirth && { dateOfBirth: ocrData.dateOfBirth }),
      ...(ocrData.sex && { sex: ocrData.sex }),
    });
  }

  return data;
}
