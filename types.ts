export enum ConversionStatus {
  IDLE = 'IDLE',
  CONVERTING = 'CONVERTING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface ConvertResponse {
  success: boolean;
  downloadUrl?: string;
  error?: string;
}

export enum Tab {
  EDITOR = 'EDITOR',
  PREVIEW = 'PREVIEW'
}