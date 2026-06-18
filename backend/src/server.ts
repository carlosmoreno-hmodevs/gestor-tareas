import { createApp } from './app';
import { envConfig } from './config/env.config';

const port = envConfig.port;
const app = createApp();

app.listen(port, () => {
  console.log(`Gamora Bot API escuchando en puerto ${port} (APP_ENV=${envConfig.appEnv})`);
});
