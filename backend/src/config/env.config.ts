export type AppEnvironment = 'local' | 'staging' | 'production' | 'development' | 'test';

function parseAppEnv(): AppEnvironment {
  const raw = (process.env.APP_ENV ?? process.env.NODE_ENV ?? 'local').toLowerCase();
  if (raw === 'staging') return 'staging';
  if (raw === 'production' || raw === 'prod') return 'production';
  if (raw === 'test') return 'test';
  if (raw === 'development' || raw === 'dev') return 'development';
  return 'local';
}

export const envConfig = {
  appEnv: parseAppEnv(),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number.parseInt(process.env.PORT ?? '3000', 10),
  isProduction: parseAppEnv() === 'production',
  isStaging: parseAppEnv() === 'staging',
  isLocal: ['local', 'development', 'test'].includes(parseAppEnv()),
};
