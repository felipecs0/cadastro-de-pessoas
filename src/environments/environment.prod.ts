// Enums
import { EnvName } from '@enums/environment.enum';

// Packages
import packageInfo from '../../package.json';

export const environment = {
  production: false,
  version: packageInfo.version,
  appName: 'cadastro de pessoas',
  envName: EnvName.LOCAL,
  apiBaseUrl: "http://localhost:3000/api",
};
