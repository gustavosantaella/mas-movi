import { API_BASE_URL } from "@/constants";

export interface OcrResult {
  facesMatch: boolean;
  confidence: number;
  documentData: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    sex: string;
    documentNumber: string;
  };
}

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

/**
 * Sends the selfie and document photos to the OCR endpoint
 * for face comparison and document data extraction.
 */
function getMimeType(uri: string): { type: string; ext: string } {
  const isPng = uri.toLowerCase().endsWith('.png');
  return isPng
    ? { type: 'image/png', ext: 'png' }
    : { type: 'image/jpeg', ext: 'jpg' };
}

export async function verifyIdentity(
  selfieUri: string,
  documentUri: string,
): Promise<ApiResponse<OcrResult>> {
  const selfieMime = getMimeType(selfieUri);
  const docMime = getMimeType(documentUri);

  const formData = new FormData();

  formData.append('selfie', {
    uri: selfieUri,
    type: selfieMime.type,
    name: `selfie.${selfieMime.ext}`,
  } as any);

  formData.append('document', {
    uri: documentUri,
    type: docMime.type,
    name: `document.${docMime.ext}`,
  } as any);

  const response = await fetch(`${API_BASE_URL}/auth/ocr/verify`, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  const data: ApiResponse<OcrResult> = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Error al verificar identidad.');
  }

  return data;
}

export interface RegisterPayload {
  email: string;
  password: string;
  userType: number;
  dni: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  sex?: string;
}

/**
 * Registers a new user with credentials and OCR-extracted data.
 */
export async function register(payload: RegisterPayload): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data: ApiResponse = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Error al registrar usuario.');
  }

  return data;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberPassword?: boolean;
}

/**
 * Logs in a user and returns a JWT token.
 */
export async function login(payload: LoginPayload): Promise<ApiResponse<{ token: string }>> {
  const response = await fetch(`${API_BASE_URL}/auth/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data: ApiResponse<{ token: string }> = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Credenciales inválidas.');
  }

  return data;
}

/**
 * Requests a password reset email.
 */
export async function forgotPassword(email: string): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const data: ApiResponse = await response.json();
  return data;
}
