export const enum ENV_TYPE {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

export type ENV = keyof typeof ENV_TYPE;
