import { IEnvironment } from '../app/models';

/**
 * Default environment used for production builds.
 */
export const environment: IEnvironment = {
  production: true,
  apiBaseUrl: 'http://localhost:5000/api/v1'
};
