const request = require('supertest');
const {
  setupDb,
  signUpUser
} = require('./utils.js');
const app = require('../lib/app');
const newHabit = { goalID:'1', habitName: 'read', statusID: '1', dueDate: '2022-03-23T20:30:00.000Z', completedDate:'2022-03-24T20:30:00.000Z' };
const newHabit2 = { goalID:'2', habitName: 'eat veggies', statusID: '1', dueDate: '2022-03-29 13:30:00', completedDate:'2022-03-30 13:30:00' };

describe('/api/v1/items', () => {
  beforeEach(setupDb);

  it('POST / creates a new habit with the current user', async () => {
    const { agent, user } = await signUpUser();
    const { status, body } = await agent.post('/api/v1/habits').send(newHabit);

    expect(status).toEqual(200);
    expect(body).toEqual({
      ...newHabit,
      id: expect.any(String),
      user_id: user.id,
      dueDate: expect.any(String),
      completedDate: expect.any(String)
    });
  });

  it('GET / returns all items associated with the authenticated User', async () => {
    const { agent } = await signUpUser();
    const { body: user1Habit } = await agent.post('/api/v1/habits').send(newHabit);

    const { agent: agent2 } = await signUpUser({
      email: 'user2@email.com',
      password: 'password',
    });

    const { body: user2Habit } = await agent2.post('/api/v1/habits').send(newHabit2);

    const resp1 = await agent.get('/api/v1/habits');
    expect(resp1.status).toEqual(200);
    expect(resp1.body).toEqual([user1Habit]);

    const resp2 = await agent2.get('/api/v1/habits');
    expect(resp2.status).toEqual(200);
    expect(resp2.body).toEqual([user2Habit]);
  });

  it('GET /:id should get a habit', async () => {
    const { agent } = await signUpUser();

    const { body: habit } = await agent.post('/api/v1/habits').send(newHabit);
    const { status, body: got } = await agent.get(`/api/v1/habits/${habit.id}`);

    expect(status).toBe(200);
    expect(got).toEqual(habit);
  });

  it('GET / should return a 401 if not authenticated', async () => {
    const { status } = await request(app).get('/api/v1/habits');
    expect(status).toEqual(401);
  });

  it('UPDATE /:id should update a habit', async () => {
    const { agent } = await signUpUser();

    const { body: habit } = await agent.post('/api/v1/habits').send(newHabit);

    const { status, body: updated } = await agent
      .put(`/api/v1/habits/${habit.id}`)
      .send({ goalID: '2' });

    expect(status).toBe(200);
    expect(updated).toEqual({ ...habit, goalID: '2' });
  });

  it('UPDATE /:id should 403 for invalid users', async () => {
    const { agent } = await signUpUser();

    const { body: habit } = await agent.post('/api/v1/habits').send(newHabit);

    const { agent: agent2 } = await signUpUser({
      email: 'user2@email.com',
      password: 'password',
    });

    const { status, body } = await agent2
      .put(`/api/v1/habits/${habit.id}`)
      .send(newHabit2);

    expect(status).toBe(403);
    expect(body).toEqual({
      status: 403,
      message: 'You do not have access to view this page',
    });
  });

  it('DELETE /:id should delete habits for valid user', async () => {
    const { agent } = await signUpUser();

    const { body: habit } = await agent.post('/api/v1/habits').send(newHabit);

    const { status, body } = await agent.delete(`/api/v1/habits/${habit.id}`);
    expect(status).toBe(200);
    expect(body).toEqual(habit);

    const { body: habits } = await agent.get('/api/v1/habits');

    expect(habits.length).toBe(0);
  });
});
