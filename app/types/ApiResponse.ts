export type ApiBaseResponse<T = unknown> = {
  message?: string;
  data?: T[];
  errors?: string[];
};

export type NormalizedApiError = Error & {
  name: "NormalizedApiError";
  status?: number;
  errors: string[];
  endpoint?: string;
  method?: string;
  isValidation: boolean;
  isAuth: boolean;
  raw?: unknown;
};
