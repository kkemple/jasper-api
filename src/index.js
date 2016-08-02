import logger from './logger'
import { getServer, loadPlugins, start } from './server'

loadPlugins(getServer())
  .then((server) => start(server))
  .catch((err) => logger.error(err))
