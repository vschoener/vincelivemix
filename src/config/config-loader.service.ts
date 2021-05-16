import { Logger } from 'winston';
import { validateOrReject } from 'class-validator';
import { Inject, Injectable, Scope } from '@nestjs/common';

import { ConfigValidationException } from './exceptions/config-validation.exception';
import { ConfigNotInitializedException } from './exceptions/config-not-initialized.exception';

@Injectable({ scope: Scope.TRANSIENT })
// TODO: validateOrReject use 1st object arfg as type, so it's hard to define a Record<> here
// eslint-disable-next-line @typescript-eslint/ban-types
export class ConfigLoaderService<T extends object> {
  private configuration: T;

  public constructor(@Inject('winston') protected logger: Logger) {
    this.logger = logger.child({ context: ConfigLoaderService.name });
  }

  public async load(configuration: T): Promise<ConfigLoaderService<T>> {
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
