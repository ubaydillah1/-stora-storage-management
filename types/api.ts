export type ApiResponse<T = unknown> = {
  message: string;
  result?: T;
};

export interface infiniteScrollParams {
  cursor?: string | null;
  limit?: number;
}
