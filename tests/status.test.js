const { setupDb, signUpUser } = require('./utils.js');

describe('/api/v1/items', () => {
  beforeEach(setupDb);

  it('GET / returns all statuses for the project', async () => {
    const { agent } = await signUpUser();
    const { status, body } = await agent.get('/api/v1/status');

    expect(status).toEqual(200);
    expect(body.length).toEqual(3);
  });

});
