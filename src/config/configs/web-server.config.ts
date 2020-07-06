import { WebServerConfigDto } from '../dto/web-server-config.dto';

export const webServerConfigDto: WebServerConfigDto = {
  port: Number(process.env.APP_PORT) || 8080,
};
