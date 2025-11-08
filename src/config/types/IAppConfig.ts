export interface IAppConfig {
  app: {
    port: number;
    nodeEnv: string;
    allowedOrigin: string[];
  };
  db: {
    mongoUri: string;
    redisHost: string;
    redisPort: number;
    redisPassword?: string;
  };
  auth: {
    jwtSecret: string;
    jwtAccessExpiresIn: string;
    jwtRefreshExpiresIn: string;
    passportSecret: string;
    googleClientId: string;
    googleClientSecret: string;
    googleRedirectUri: string;
    clientUrl: string;
  };
  session: {
    secret: string;
    maxAge: number;
  };
}
