import { utilities } from 'nest-winston';
import { format, LoggerOptions, transports } from 'winston';

export const loggerSettings: LoggerOptions = {
  exitOnError: false,
  format: format.timestamp(),
  level: process.env.LOGGER_LEVEL || 'debug', // TODO: move settings to config module
  transports: [
    new transports.Console({
      format: format.combine(utilities.format.nestLike()),
    }),
  ],
};
