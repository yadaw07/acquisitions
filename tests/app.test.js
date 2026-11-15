import request from 'supertest';
import app from '#src/app.js';

describe('API Endpoints', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamps');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('GET /metrics', () => {
    it('should expose default and HTTP metrics in Prometheus format', async () => {
      await request(app).get('/health').expect(200);

      const response = await request(app).get('/metrics').expect(200);

      expect(response.headers['content-type']).toMatch(
        /text\/plain; version=0\.0\.4/
      );
      expect(response.text).toContain('nodejs_cpu_user_seconds_total');
      expect(response.text).toContain('process_resident_memory_bytes');
      expect(response.text).toContain('nodejs_eventloop_lag_seconds');
      expect(response.text).toContain(
        'http_requests_total{method="GET",route="/health",status_code="200"}'
      );
      expect(response.text).toContain(
        'http_request_duration_seconds_bucket{method="GET",route="/health",status_code="200",le="0.1"}'
      );
    });

    it('should use the Express route template for dynamic path parameters', async () => {
      await request(app).get('/api/users/123').expect(401);
      await request(app).get('/api/users/456').expect(401);

      const response = await request(app).get('/metrics').expect(200);

      expect(response.text).toContain(
        'http_requests_total{method="GET",route="/api/users/:id",status_code="401"}'
      );
    });
  });

  describe('GET /api', () => {
    it('should return API message', async () => {
      const response = await request(app).get('/api').expect(200);

      expect(response.body).toHaveProperty(
        'message',
        'Acquisitions API is running!'
      );
    });
  });

  describe('GET /nonexistent', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/nonexistent').expect(404);

      expect(response.body).toHaveProperty('error', 'Route not found');
    });
  });
});
