import { getContainer } from './setup';

module.exports = async () => {
  await getContainer().stop();
};
