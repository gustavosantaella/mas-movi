import { API_BASE_URL } from '@/constants';

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

/**
 * Fetches the authenticated user's profile.
 */
export async function getProfile(token: string): Promise<ApiResponse<UserProfile>> {
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

  return data;
}

/**
 * Updates user profile fields (firstName, lastName, dateOfBirth).
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

  return data;
}

/**
 * Confirms entity after successful OCR, also saves extracted OCR data.
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

  return data;
}
