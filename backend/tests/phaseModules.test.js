const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models');

describe('Phase module routes', () => {
  let token;

  beforeAll(async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'hq.safety@demo.local', password: 'Password@123' });

    token = response.body.data.tokens.accessToken;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('lists implemented phase modules for an authenticated user', async () => {
    const endpoints = ['/api/risks', '/api/trainings', '/api/toolbox-meetings', '/api/activities', '/api/plans', '/api/actions'];

    for (const endpoint of endpoints) {
      const response = await request(app).get(endpoint).set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    }
  });
});
