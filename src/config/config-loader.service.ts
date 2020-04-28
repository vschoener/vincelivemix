import { Logger } from 'winston';
import { validateOrReject } from 'class-validator';
import { ConfigValidationException } from './exceptions/config-validation.exception';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ConfigLoaderService<T = any> {
  private configuration: T;

  public constructor(@Inject('winston') protected logger: Logger) {
    this.logger = logger.child({ context: ConfigLoaderService.name });
  }

  public async load(configuration: T) {
    this.logger.debug('Loading...');

    await this.validate(configuration);

    this.configuration = configuration;
    this.logger.debug('Loaded', { configuration });

    return this;
  }

  public isLoaded(): boolean {
    return !!this.configuration;
  }

  public get(): T {
    return this.configuration;
  }

  private async validate(configuration: T) {
    try {
      await validateOrReject(configuration);
    } catch (err) {
      this.logger.error('Configuration is not valid', { err });
      throw new ConfigValidationException('Configuration is not valid');
    }
  }
}
