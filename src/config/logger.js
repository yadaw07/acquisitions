import winston from 'winston';

const isProduction = process.env.NODE_ENV === 'production';
const enableFileLogging = process.env.LOG_TO_FILE === 'true';

const transports = [
  new winston.transports.Console({
    format: isProduction
      ? winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
      : winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
  }),
];

if (enableFileLogging) {
  transports.push(
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  );
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'acquisitions-api' },
  transports,
});

export default logger;
