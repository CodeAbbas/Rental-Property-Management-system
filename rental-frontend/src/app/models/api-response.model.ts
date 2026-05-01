/**
 * Standard message response returned by mutation endpoints.
 */
export interface IApiMessage {
  /** Human-readable backend response message. */
  message: string;
}

/**
 * Standard error response returned by the Flask API.
 */
export interface IApiError {
  /** Human-readable error message. */
  error: string;

  /** Optional technical details included by the backend. */
  details?: string;
}

/**
 * Response returned by the favorites endpoint.
 */
export interface IFavoritesResponse {
  /** Array of listing ids favorited by the authenticated user. */
  favorites: string[];
}
