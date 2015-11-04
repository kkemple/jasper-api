import bunyan from 'bunyan';

const log = bunyan.createLogger({
  name: 'skynet.api',
  streams: process.env.NODE_ENV === 'test' ? [] : [
    {
      level: 'info',
      stream: process.stdout,
    },
    {
      level: 'error',
      stream: process.stdout,
    },
  ],
});

export default log;
