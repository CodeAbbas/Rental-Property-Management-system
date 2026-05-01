import { UserRole } from './user.model';

/**
 * Login form payload submitted to the Flask authentication endpoint.
 */
export interface ILoginPayload {
  /** Username entered by the user. */
  username: string;

  /** Password entered by the user. */
  password: string;
}

/**
 * Successful authentication response returned by the Flask API.
 */
export interface IAuthResponse {
  /** JWT token used for authenticated API calls. */
  token: string;

  /** Optional backend-provided user id. */
  user_id?: string;

  /** Optional backend-provided username. */
  username?: string;

  /** Optional backend-provided role. */
  role?: UserRole;
}
