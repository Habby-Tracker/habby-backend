const request = require('supertest');
const { setupDb, signUpUser } = require('./utils.js');
const app = require('../lib/app');

const newGoal = {
  goalCategoryID: '1',
  goalName: 'test goal',
  timePeriodID: '1',
  habitTypeID: '1',
  habitName: 'test habit',
  statusID: '1',
};
const newGoal2 = {
  goalCategoryID: '1',
  goalName: 'test goal for user 2',
  timePeriodID: '1',
  habitTypeID: '1',
  habitName: 'test habit for user 2',
  statusID: '1',
};

describe('/api/v1/items', () => {
  beforeEach(setupDb);

  it('POST / creates a new shopping item with the current user', async () => {
    const { agent, user } = await signUpUser();

    const { status, body } = await agent.post('/api/v1/goals').send(newGoal);

    expect(status).toEqual(200);
    expect(body).toEqual({
      ...newGoal,
      id: expect.any(String),
      user_id: user.id,
      createdAt: expect.any(String),
    });
  });

  it('GET / returns all goals associated with the authenticated User', async () => {
    const { agent } = await signUpUser();
    const { body: user1Goal } = await agent.post('/api/v1/goals').send(newGoal);

    const { agent: agent2 } = await signUpUser({
      email: 'user2@email.com',
      password: 'password',
      first_name: 'user2',
      last_name: 'user2',
      avatar: 'user2',
    });

    const { body: user2Goal } = await agent2
      .post('/api/v1/goals')
      .send(newGoal2);

    const resp1 = await agent.get('/api/v1/goals');
    expect(resp1.status).toEqual(200);
    expect(resp1.body).toEqual([{ ...user1Goal, status: 'Active' }]);

    const resp2 = await agent2.get('/api/v1/goals');
    expect(resp2.status).toEqual(200);
    expect(resp2.body).toEqual([{ ...user2Goal, status: 'Active' }]);
  });

  it('GET /:id should get a goal', async () => {
    const { agent } = await signUpUser();

    const { body: goal } = await agent.post('/api/v1/goals').send(newGoal);
    const { status, body: got } = await agent.get(`/api/v1/goals/${goal.id}`);

    expect(status).toBe(200);
    expect(got).toEqual({ ...goal, status: 'Active' });
  });

  it('GET / should return a 401 if not authenticated', async () => {
    const { status } = await request(app).get('/api/v1/goals');
    expect(status).toEqual(401);
  });

  it('UPDATE /:id should update a goal', async () => {
    const { agent } = await signUpUser();

    const { body: goal } = await agent.post('/api/v1/goals').send(newGoal);

    const { status, body: updated } = await agent
      .put(`/api/v1/goals/${goal.id}`)
      .send({ statusID: '2' });

    expect(status).toBe(200);
    expect(updated).toEqual({ ...goal, statusID: '2' });
  });

  it('UPDATE /:id should 403 for invalid users', async () => {
    const { agent } = await signUpUser();

    const { body: goal } = await agent.post('/api/v1/goals').send(newGoal);

    const { agent: agent2 } = await signUpUser({
      email: 'user2@email.com',
      password: 'password',
      first_name: 'user2',
      last_name: 'user2',
      avatar: 'user2',
    });

    const { status, body } = await agent2
      .put(`/api/v1/goals/${goal.id}`)
      .send({ statusID: '2' });

    expect(status).toBe(403);
    expect(body).toEqual({
      status: 403,
      message: 'You do not have access to view this page',
    });
  });

  it('DELETE /:id should delete goals for valid user', async () => {
    const { agent } = await signUpUser();

    const { body: goal } = await agent.post('/api/v1/goals').send(newGoal);

    const { status, body } = await agent.delete(`/api/v1/goals/${goal.id}`);
    expect(status).toBe(200);
    expect(body).toEqual(goal);

    const { body: goals } = await agent.get('/api/v1/goals');

    expect(goals.length).toBe(0);
  });
});
