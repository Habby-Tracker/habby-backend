// const request = require('supertest');
const { setupDb, signUpUser } = require('./utils.js');
// const app = require('../lib/app');

describe('/api/v1/time-periods', () => {
  beforeEach(setupDb);

  it('GET / returns all time periods for the authenticated User', async () => {
    const { agent } = await signUpUser();
    const { status, body } = await agent.get('/api/v1/time-periods');

    expect(status).toEqual(200);
    expect(body.length).toEqual(3);
  });

  //   it('GET / should return a 401 if not authenticated', async () => {
  //     const { status } = await request(app).get('/api/v1/goals');
  //     expect(status).toEqual(401);
  //   });
});
