import { performance } from 'node:perf_hooks';

import {
  httpRequestDurationSeconds,
  httpRequestsTotal,
} from '#config/prometheus.js';

function getRouteLabel(req) {
  if (typeof req.route?.path !== 'string') {
    return 'unmatched';
  }

  return `${req.baseUrl}${req.route.path}` || '/';
}

export function metricsMiddleware(req, res, next) {
  const start = performance.now();

  res.once('finish', () => {
    const labels = {
      method: req.method,
      route: getRouteLabel(req),
      status_code: String(res.statusCode),
    };

    httpRequestsTotal.inc(labels);
    httpRequestDurationSeconds.observe(
      labels,
      (performance.now() - start) / 1000
    );
  });

  next();
}
