import logger from './logger'
import { getServer, loadPlugins, start } from './server'

loadPlugins(getServer())
  .then((server) => start(server))
  .then(() => logger.info('server started'))
  .catch((err) => logger.error(err))
