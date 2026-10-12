import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { api, createUser, login, startServer, stopServer } from './helpers.js';

describe('event card designs', () => {
  let user;
  let other;
  let path;

  before(async () => {
    await startServer();
    user = await createUser();
    other = await createUser();
    const events = await api('/events?limit=1');
    path = `/events/${events.body.events[0].id}/card-design`;
  });
  after(stopServer);

  const save = (design, token = user.token) =>
    api(path, { method: 'PUT', body: design, token });

  it('requires a token', async () => {
    assert.equal((await api(path)).status, 401);
  });

  it('returns null when nothing has been saved', async () => {
    const res = await api(path, { token: user.token });
    assert.equal(res.body.design, null);
  });

  it('saves a theme with up to three stickers', async () => {
    const res = await save({ theme: 'forest', stickers: ['party', 'star', 'fire'] });
    assert.equal(res.status, 200);
    assert.deepEqual(res.body.design, {
      theme: 'forest',
      stickers: ['party', 'star', 'fire'],
    });
  });

  it('rejects a fourth sticker and keeps the saved design', async () => {
    const res = await save({
      theme: 'ocean',
      stickers: ['star', 'fire', 'heart', 'music'],
    });
    assert.equal(res.status, 400);

    const current = await api(path, { token: user.token });
    assert.equal(current.body.design.theme, 'forest');
    assert.equal(current.body.design.stickers.length, 3);
  });

  it('rejects unknown themes and stickers', async () => {
    assert.equal((await save({ theme: 'neon', stickers: [] })).status, 400);
    assert.equal((await save({ theme: 'ocean', stickers: ['skull'] })).status, 400);
  });

  it('replaces the design and persists it across logins', async () => {
    await save({ theme: 'ocean', stickers: ['music'] });
    await save({ theme: 'sunset', stickers: [] });
    await save({ theme: 'ocean', stickers: ['heart', 'star'] });

    const freshToken = await login(user.email);
    const res = await api(path, { token: freshToken });
    assert.deepEqual(res.body.design, { theme: 'ocean', stickers: ['heart', 'star'] });
  });

  it('keeps designs separate for each user', async () => {
    const res = await api(path, { token: other.token });
    assert.equal(res.body.design, null);
  });
});
