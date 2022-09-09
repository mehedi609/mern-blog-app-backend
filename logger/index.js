const { createLogger, format, transports } = require('winston');

const { combine, colorize, splat, printf } = format;

const productionFormat = () => {
  const replaceError = ({ label, level, message, stack }) => ({
    label,
    level,
    message,
    stack,
  });

  const replacer = (key, value) =>
    value instanceof Error ? replaceError(value) : value;

  return combine(
    splat(),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.json({ replacer }),
  );
};

const developmentFormat = () => {
  const formatMessage = (info) => `${info.level} ${info.message}`;

  const formatError = (info) =>
    `${info.level} ${info.message}\n\n${info.stack}\n`;

  const fmt = (info) =>
    info instanceof Error ? formatError(info) : formatMessage(info);

  return combine(
    format((info) => {
      info.level = info.level.toUpperCase();
      return info;
    })(),
    colorize(),
    splat(),
    printf(fmt),
  );
};

const logger = createLogger({
  exitOnError: false,
  format:
    process.env.NODE_ENV === 'production'
      ? productionFormat()
      : developmentFormat(),
  level: 'silly',
  transports: [new transports.Console()],
});

module.exports = logger;
