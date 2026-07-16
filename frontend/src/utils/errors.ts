interface BackendErrorResponse {
  response?: {
    data?: {
      detail?: string;
    };
  };
}

export const extractErrorMessage = (err: unknown, fallback: string): string => {
  const backendMessage = (err as BackendErrorResponse)?.response?.data?.detail;
  return backendMessage || fallback;
};