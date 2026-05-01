import { IEnvironment } from '../app/models';

/**
 * Development environment used by ng serve.
 */
export const environment: IEnvironment = {
  production: false,
  apiBaseUrl: 'http://localhost:5000/api/v1'
};
