/**
 * Strongly typed Angular environment configuration.
 */
export interface IEnvironment {
  /** Indicates whether the Angular application is running in production mode. */
  production: boolean;

  /** Base REST API URL used by all frontend services. */
  apiBaseUrl: string;
}
