/**
 * Supported user roles used by the backend authorization layer.
 */
export type UserRole = 'admin' | 'landlord' | 'renter';

/**
 * Represents an authenticated application user.
 */
export interface IUser {
  /** MongoDB user identifier serialized as a string. */
  _id: string;

  /** Unique username used for login. */
  username: string;

  /** Email address associated with the account. */
  email?: string;

  /** Authorization role assigned by the backend. */
  role: UserRole;

  /** Array of favorited listing ids. */
  favorites?: string[];

  /** Array of saved search documents for the user. */
  saved_searches?: ISavedSearch[];
}

/**
 * Represents a saved search sub-document stored against a user profile.
 */
export interface ISavedSearch {
  /** Saved search identifier. */
  search_id: string;

  /** User-facing name for the saved search. */
  query_name: string;

  /** Flexible filter object stored by the Flask API. */
  filters: Record<string, string | number | boolean>;
}

/**
 * Payload used when registering a new user.
 */
export interface IRegisterPayload {
  /** Desired username. */
  username: string;

  /** Plain text password submitted to the backend over HTTP. */
  password: string;

  /** Optional email address. */
  email?: string;

  /** Optional requested role. */
  role?: UserRole;
}
