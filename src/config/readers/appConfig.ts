import { env } from "./env.js";
import { defaultConfig } from "../constants/defaultConfig.js";
import type { IAppConfig } from "../types/IAppConfig.js";

class AppConfig {
  private static instance: AppConfig;
  public config: IAppConfig;

  private constructor() {
    this.config = JSON.parse(JSON.stringify(defaultConfig));
    this.setAppConfig();
    this.setDBConfig();
    this.setAuthConfig();
  }

  public static getInstance() {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }
    return AppConfig.instance;
  }

  private setAppConfig(): void {
    this.config.app.port = env.PORT;
    this.config.app.nodeEnv = env.NODE_ENV;
    this.config.app.allowedOrigin = env.ALLOWED_ORIGIN.split(',').map((origin: string) => origin.trim());
  }

  private setDBConfig(): void {
    this.config.db.mongoUri = env.MONGO_URI;

  }

  private setAuthConfig(): void {
    this.config.auth.jwtSecret = env.JWT_SECRET;
    this.config.auth.jwtAccessExpiresIn = env.JWT_ACCESS_EXPIRES_IN;
    this.config.auth.jwtRefreshExpiresIn = env.JWT_REFRESH_EXPIRES_IN;
    this.config.auth.clientUrl = env.CLIENT_URL;
    this.config.session.secret = env.SESSION_SECRET;
  }
}

export const appConfig = AppConfig.getInstance().config;
