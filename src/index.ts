/* eslint-disable global-require */
import os from 'os';
import { ClusterApplication, Connector, IApplicationPayload } from '@dkdao/framework';
import config from './helper/config';
import logger from './helper/logger';

Connector.connectByUrl(config.fantomDbUrl, 'fantom');
Connector.connectByUrl(config.polygonDbUrl, 'polygon');
Connector.connectByUrl(config.binaceDbUrl, 'binance');

const main = new ClusterApplication();

main.on('new', (environment: IApplicationPayload) => {
  logger.info('Add new cluster name:', environment.name, 'Payload:', environment.payload);
});

main.on('error', (err: Error) => {
  logger.error('Found an error', err);
});

main.on('restart', (pid: number, environment: IApplicationPayload) => {
  logger.info('Restart', environment.name, 'at:', pid);
});

main.on('exit', (signal: string) => {
  logger.info('Received', signal, 'we are going to terminate child processes');
});

if (config.nodeEnv === 'development') {
  require('./apollo');
} else {
  // In other environment, we start all instances equals to the number of cpus
  const numCpus = os.cpus().length;
  for (let i = 0; i < numCpus; i += 1) {
    main.add({
      name: `apollo-server-${i}`,
      payload: `${__dirname}/apollo`,
    });
  }
  main.start();
}
