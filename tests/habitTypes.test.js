const { setupDb, signUpUser } = require('./utils.js');

describe('/api/v1/habitTypes', () => {
  beforeEach(setupDb);

  it('GET / returns all habit types', async () => {
    const { agent } = await signUpUser();
    const { status, body } = await agent.get('/api/v1/habit-types');

    expect(status).toEqual(200);
    expect(body.length).toEqual(3);
  });
});
