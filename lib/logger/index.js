import bunyan from 'bunyan';

const log = bunyan.createLogger({
  name: 'myapp',
  streams: [
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
