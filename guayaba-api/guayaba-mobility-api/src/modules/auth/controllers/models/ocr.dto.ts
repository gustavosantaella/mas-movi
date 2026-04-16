export class OcrVerifyDto {
  /** Base64-encoded selfie image */
  selfie: string;

  /** Base64-encoded DNI or Passport image */
  document: string;
}
