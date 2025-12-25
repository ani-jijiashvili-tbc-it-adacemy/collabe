export type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export interface FormState {
  status: FormStatus;
  errorMessage: string | null;
}