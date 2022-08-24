// const request = require('supertest');
const { setupDb, signUpUser } = require('./utils.js');
// const app = require('../lib/app');

const newCategory = { name: 'Other', defaultIcon: 'https://i.imgur.com/0Z0Z7Z0.png', user_id: null };

describe('/api/v1/items', () => {
  beforeEach(setupDb);

  it('GET / returns all catagories for the authenticated User', async () => {
    const { agent } = await signUpUser();
    const { status, body } = await agent.get('/api/v1/categories');

    expect(status).toEqual(200);
    expect(body.length).toEqual(10);
  });

  it('POST / adds a new category for the user', async () => {
    const { agent } = await signUpUser();
    const { status, body } = await agent.post('/api/v1/categories').send(newCategory);

    expect(status).toEqual(200);
    expect(body).toEqual({
      ...newCategory,
      id: expect.any(String)
    });
  });






});
