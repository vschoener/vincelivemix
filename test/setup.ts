import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';
import * as dotenv from 'dotenv';

dotenv.config();

let container: StartedTestContainer;

export default async (): Promise<void> => {
  container = await new GenericContainer('postgres', '12.3')
    .withExposedPorts(5432)
    .withEnv('POSTGRES_USER', process.env.POSTGRES_USER)
    .withEnv('POSTGRES_PASSWORD', process.env.POSTGRES_PASSWORD)
    .withEnv('POSTGRES_DB', process.env.POSTGRES_DB)
    .withWaitStrategy(
      Wait.forLogMessage('database system is ready to accept connections'),
    )
    .start();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  process.env.POSTGRES_PORT = container.getMappedPort(5432);
};

export const getContainer = (): StartedTestContainer => container;
