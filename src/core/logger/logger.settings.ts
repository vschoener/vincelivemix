import { utilities } from 'nest-winston';
import { format, LoggerOptions, transports } from 'winston';

export const loggerSettings: LoggerOptions = {
  exitOnError: false,
  format: format.timestamp(),
  transports: [
    new transports.Console({
      format: format.combine(utilities.format.nestLike()),
    }),
  ],
};
