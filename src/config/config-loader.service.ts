import { Logger } from 'winston';
import { validateOrReject } from 'class-validator';
import { ConfigValidationException } from './exceptions/config-validation.exception';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { ConfigNotInitializedException } from './exceptions/config-not-initialized.exception';

@Injectable({ scope: Scope.TRANSIENT })
export class ConfigLoaderService<T> {
  private configuration: T;

  public constructor(@Inject('winston') protected logger: Logger) {
    this.logger = logger.child({ context: ConfigLoaderService.name });
  }

  public async load(configuration: T) {
    this.logger.info(`Loading ${configuration.constructor.name}...`);

    await this.validate(configuration);

    this.configuration = configuration;
    this.logger.debug('Loaded', { configuration });

    return this;
  }

  public get(): T {
    if (!this.configuration) {
      throw new ConfigNotInitializedException(`Configuration not loaded`);
    }

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
