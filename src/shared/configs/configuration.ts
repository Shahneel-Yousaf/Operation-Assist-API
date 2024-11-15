export default (): any => ({
  env: process.env.APP_ENV,
  port: process.env.APP_PORT,
  database: {
    masterUrl: process.env.MASTER_DB_URL,
    requestTimeout: process.env.MSSQL_REQUEST_TIMEOUT,
    connectionTimeout: process.env.MSSQL_CONNECTION_TIMEOUT,
  },
  permissionTokenDuration: process.env.PERMISSION_TOKEN_DURATION,
  auth: {
    audience: process.env.AUDIENCE,
    issuer: process.env.ISSUER,
    jwksUri: process.env.JWKS_URI,
  },
  azure: {
    storeAccount: {
      storageAccount: process.env.STORAGE_ACCOUNT,
      storageContainer: process.env.STORAGE_CONTAINER,
      storageConnectionKey: process.env.STORAGE_CONNECTION_KEY,
    },
    storeAccountFile: {
      fileStoreAccount: process.env.FILE_STORAGE_ACCOUNT,
      fileStorageContainer: process.env.FILE_STORAGE_CONTAINER,
      fileStorageConnectionKey: process.env.FILE_STORAGE_CONNECTION_KEY,
    },
    graphApi: {
      tenantId: process.env.TENANT_ID,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    },
  },
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  },
  versionApp: {
    ios: process.env.REQUIRED_CLIENT_VERSION_IOS,
    android: process.env.REQUIRED_CLIENT_VERSION_ANDROID,
  },
});
