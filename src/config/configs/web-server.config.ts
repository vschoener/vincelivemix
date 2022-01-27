import { WebServerConfigDto } from '../dto/web-server-config.dto';

export const webServerConfigDto: WebServerConfigDto = {
  port: Number(process.env.PORT) || 8080,
};
