import * as Joi from '@hapi/joi';
import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';

import configuration from './configuration';

export const configModuleOptions: ConfigModuleOptions = {
  envFilePath: '.env',
  load: [configuration],
  validationSchema: Joi.object({
    APP_ENV: Joi.string()
      .valid('local', 'development', 'production', 'staging', 'test')
      .default('development'),
    APP_PORT: Joi.number().required(),
    MASTER_DB_URL: Joi.string().required(),
    JWKS_URI: Joi.string().required(),
    ISSUER: Joi.string().required(),
    AUDIENCE: Joi.string().required(),
    STORAGE_ACCOUNT: Joi.string().required(),
    STORAGE_CONTAINER: Joi.string().required(),
    STORAGE_CONNECTION_KEY: Joi.string().required(),
    PERMISSION_TOKEN_DURATION: Joi.number().required(),
    FIREBASE_PROJECT_ID: Joi.string().required(),
    FIREBASE_PRIVATE_KEY: Joi.string().required(),
    FIREBASE_CLIENT_EMAIL: Joi.string().required(),
    FILE_STORAGE_ACCOUNT: Joi.string().required(),
    FILE_STORAGE_CONTAINER: Joi.string().required(),
    FILE_STORAGE_CONNECTION_KEY: Joi.string().required(),
    REQUIRED_CLIENT_VERSION_IOS: Joi.string().required(),
    REQUIRED_CLIENT_VERSION_ANDROID: Joi.string().required(),
    TENANT_ID: Joi.string().required(),
    CLIENT_ID: Joi.string().required(),
    CLIENT_SECRET: Joi.string().required(),
    MSSQL_REQUEST_TIMEOUT: Joi.number().required(),
    MSSQL_CONNECTION_TIMEOUT: Joi.number().required(),
  }),
};
