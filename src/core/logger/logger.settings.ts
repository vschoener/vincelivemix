import { utilities } from 'nest-winston';
import winston from 'winston';

export const loggerSettings = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        utilities.format.nestLike(),
      ),
    }),
    // other transports...
  ],
  // other options
};
