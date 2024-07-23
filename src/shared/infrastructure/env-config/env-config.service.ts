import { Injectable } from '@nestjs/common';
import { EnvConfig } from './env-config.interfaces';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvConfigService implements EnvConfig {
  constructor(private configService: ConfigService) {}

  getAppPort(): number {
    return Number(this.configService.get<number>('PORT'));
  }

  getNodeEnv(): string {
    return this.configService.get<string>('NODE_ENV');
  }

  getJwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }

  getJwtExpiratesInSeconds(): number {
    return Number(this.configService.get<number>('JWT_EXPIRES_IN'));
  }
}