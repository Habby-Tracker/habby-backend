const request = require('supertest');
const { setupDb, signUpUser } = require('./utils.js');
const app = require('../lib/app');
const newMood = {
  mood: 'happy',
  date: '2022-08-24',
};
const newMood2 = {
  mood: 'sad',
  date: '2022-08-24',
};

describe('/api/v1/moods', () => {
  beforeEach(setupDb);

  it('POST / creates a new mood for the current user', async () => {
    const { agent, user } = await signUpUser();
    const { status, body } = await agent.post('/api/v1/moods').send(newMood);

    expect(status).toEqual(200);
    expect(body).toEqual({
      ...newMood,
      id: expect.any(String),
      user_id: user.id,
      date: expect.any(String),
      createdAt: expect.any(String),
    });
  });

  it('GET / returns all moods associated with the authenticated User', async () => {
    const { agent } = await signUpUser();
    const { body: user1Mood } = await agent.post('/api/v1/moods').send(newMood);

    const { agent: agent2 } = await signUpUser({
      email: 'user2@email.com',
      password: 'password',
    });

    const { body: user2Mood } = await agent2
      .post('/api/v1/moods')
      .send(newMood2);

    const resp1 = await agent.get('/api/v1/moods');
    expect(resp1.status).toEqual(200);
    expect(resp1.body).toEqual([user1Mood]);

    const resp2 = await agent2.get('/api/v1/moods');
    expect(resp2.status).toEqual(200);
    expect(resp2.body).toEqual([user2Mood]);
  });

  it('GET /:id should get a mood', async () => {
    const { agent } = await signUpUser();

    const { body: mood } = await agent.post('/api/v1/moods').send(newMood);
    const { status, body: got } = await agent.get(`/api/v1/moods/${mood.id}`);

    expect(status).toBe(200);
    expect(got).toEqual(mood);
  });

  it('GET / should return a 401 if not authenticated', async () => {
    const { status } = await request(app).get('/api/v1/moods');
    expect(status).toEqual(401);
  });

  it('UPDATE /:id should update a mood', async () => {
    const { agent } = await signUpUser();

    const { body: mood } = await agent.post('/api/v1/moods').send(newMood);

    const { status, body: updated } = await agent
      .put(`/api/v1/moods/${mood.id}`)
      .send({ mood: 'unsure' });

    expect(status).toBe(200);
    expect(updated).toEqual({ ...mood, mood: 'unsure' });
  });

  it('UPDATE /:id should 403 for invalid users', async () => {
    const { agent } = await signUpUser();

    const { body: mood } = await agent.post('/api/v1/moods').send(newMood);

    const { agent: agent2 } = await signUpUser({
      email: 'user2@email.com',
      password: 'password',
    });

    const { status, body } = await agent2
      .put(`/api/v1/moods/${mood.id}`)
      .send(newMood2);

    expect(status).toBe(403);
    expect(body).toEqual({
      status: 403,
      message: 'You do not have access to view this page',
    });
  });

  it('DELETE /:id should delete moods for valid user', async () => {
    const { agent } = await signUpUser();

    const { body: mood } = await agent.post('/api/v1/moods').send(newMood);

    const { status, body } = await agent.delete(`/api/v1/moods/${mood.id}`);
    expect(status).toBe(200);
    expect(body).toEqual(mood);

    const { body: moods } = await agent.get('/api/v1/moods');

    expect(moods.length).toBe(0);
  });
});
