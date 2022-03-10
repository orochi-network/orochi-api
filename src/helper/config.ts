import { ConfigLoader, Singleton, Utilities, Validator } from '@dkdao/framework';

interface IAppConfiguration {
  nodeEnv: string;
  fantomDbUrl: string;
  polygonDbUrl: string;
  serviceBindAddress: { host: string; port: number };
}

const configLoader = Singleton<ConfigLoader>(
  'oracle-config',
  ConfigLoader,
  `${Utilities.File.getRootFolder()}/.env`,
  new Validator(
    {
      name: 'nodeEnv',
      type: 'string',
      location: 'any',
      defaultValue: 'development',
      require: true,
      enums: ['development', 'production', 'staging'],
    },
    {
      name: 'fantomDbUrl',
      type: 'string',
      location: 'any',
      require: true,
      postProcess: (e) => e.trim(),
      validator: (e) => /^mysql:\/\//i.test(e),
      message: 'This configuration should look like: mysql://user:password@localhost:port/database',
    },
    {
      name: 'polygonDbUrl',
      type: 'string',
      location: 'any',
      require: true,
      postProcess: (e) => e.trim(),
      validator: (e) => /^mysql:\/\//i.test(e),
      message: 'This configuration should look like: mysql://user:password@localhost:port/database',
    },
    {
      name: 'serviceBindAddress',
      type: 'string',
      location: 'any',
      validator: (e) => e.split(':').length === 2,
      message: 'The format should be 0.0.0.0:1337',
      require: true,
      postProcess: (e: string) => {
        const [host, port] = e.split(':').map((v, i) => (i === 0 ? v.trim() : parseInt(v.trim(), 10)));
        return {
          host,
          port,
        };
      },
    },
  ),
);

export const config: IAppConfiguration = configLoader.getConfig();

export default config;
