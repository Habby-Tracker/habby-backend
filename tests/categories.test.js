// const request = require('supertest');
const { setupDb, signUpUser } = require('./utils.js');
// const app = require('../lib/app');

const newCategory = { name: 'Other', defaultIcon: 'https://i.imgur.com/0Z0Z7Z0.png', user_id: '1' };

describe('/api/v1/categories', () => {
  beforeEach(setupDb);

  it('GET / returns all catagories for the authenticated User', async () => {
    const { agent } = await signUpUser();
    await agent.post('/api/v1/categories').send(newCategory);
    const { status, body } = await agent.get('/api/v1/categories');

    expect(status).toEqual(200);
    expect(body.length).toEqual(1);
  });

  it('GET /:id should return a specific category', async () => {
    const { agent } = await signUpUser();
    const { body: category } = await agent.post('/api/v1/categories').send(newCategory);
    const { status, body } = await agent.get(`/api/v1/categories/${category.id}`);

    expect(status).toEqual(200);
    expect(body).toEqual(category);
  });

  it('POST / adds a new category for the user', async () => {
    const { agent } = await signUpUser();
    const { status, body } = await agent.post('/api/v1/categories').send(newCategory);

    expect(status).toEqual(200);
    expect(body).toEqual({
      ...newCategory,
      id: expect.any(String),
      user_id: expect.any(String)
    });
  });
  
  it('DELETE /:id will delete a specific category', async () => {
    const { agent } = await signUpUser();
    const { body: category } = await agent.post('/api/v1/categories').send(newCategory);
    const { status, body } = await agent.delete(`/api/v1/categories/${category.id}`);

    expect(status).toEqual(200);
    expect(body).toEqual(category);

    const { body: categories } = await agent.get('/api/v1/categories');
    expect(categories.length).toEqual(0);
  });


});
