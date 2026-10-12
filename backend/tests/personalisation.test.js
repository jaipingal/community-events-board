import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { api, createUser, login, startServer, stopServer } from './helpers.js';

describe('favourite categories and feed', () => {
  let user;

  before(async () => {
    await startServer();
    user = await createUser();
  });
  after(stopServer);

  it('starts with no favourites and an empty feed', async () => {
    const favourites = await api('/me/favorite-categories', { token: user.token });
    const feed = await api('/me/feed', { token: user.token });

    assert.deepEqual(favourites.body.categories, []);
    assert.deepEqual(feed.body.events, []);
  });

  it('requires a token', async () => {
    assert.equal((await api('/me/feed')).status, 401);
    assert.equal((await api('/me/favorite-categories')).status, 401);
  });

  it('rejects unknown categories', async () => {
    const res = await api('/me/favorite-categories', {
      method: 'PUT',
      body: { categories: ['ART'] },
      token: user.token,
    });
    assert.equal(res.status, 400);
  });

  it('builds the feed from the saved categories', async () => {
    const saved = await api('/me/favorite-categories', {
      method: 'PUT',
      body: { categories: ['music', 'KIDS', 'MUSIC'] },
      token: user.token,
    });
    assert.deepEqual(saved.body.categories.sort(), ['KIDS', 'MUSIC']);

    const feed = await api('/me/feed?limit=50', { token: user.token });
    assert.ok(feed.body.events.length > 0);

    const now = Date.now();
    for (const event of feed.body.events) {
      assert.ok(['MUSIC', 'KIDS'].includes(event.category));
      assert.equal(event.isActive, true);
      assert.ok(new Date(event.startsAt).getTime() > now);
    }
  });

  it('replaces favourites and keeps them after a new login', async () => {
    await api('/me/favorite-categories', {
      method: 'PUT',
      body: { categories: ['FOOD'] },
      token: user.token,
    });

    const freshToken = await login(user.email);
    const favourites = await api('/me/favorite-categories', { token: freshToken });
    assert.deepEqual(favourites.body.categories, ['FOOD']);

    const feed = await api('/me/feed?limit=50', { token: freshToken });
    assert.ok(feed.body.events.length > 0);
    assert.ok(feed.body.events.every((event) => event.category === 'FOOD'));
  });
});

describe('reminders', () => {
  let user;
  let eventId;

  before(async () => {
    await startServer();
    user = await createUser();
    const events = await api('/events?limit=1');
    eventId = events.body.events[0].id;
  });
  after(stopServer);

  it('requires a token', async () => {
    assert.equal((await api(`/events/${eventId}/reminder`)).status, 401);
    assert.equal(
      (await api(`/events/${eventId}/reminder`, { method: 'PUT' })).status,
      401,
    );
  });

  it('is off by default', async () => {
    const res = await api(`/events/${eventId}/reminder`, { token: user.token });
    assert.equal(res.body.reminder, false);
  });

  it('can be enabled repeatedly and persists across logins', async () => {
    const path = `/events/${eventId}/reminder`;

    await api(path, { method: 'PUT', token: user.token });
    const again = await api(path, { method: 'PUT', token: user.token });
    assert.equal(again.status, 200);
    assert.equal(again.body.reminder, true);

    const freshToken = await login(user.email);
    const res = await api(path, { token: freshToken });
    assert.equal(res.body.reminder, true);
  });

  it('can be disabled again', async () => {
    const path = `/events/${eventId}/reminder`;

    const off = await api(path, { method: 'DELETE', token: user.token });
    assert.equal(off.body.reminder, false);

    const res = await api(path, { token: user.token });
    assert.equal(res.body.reminder, false);
  });

  it('lists the events the user has a reminder for', async () => {
    const path = `/events/${eventId}/reminder`;
    await api(path, { method: 'PUT', token: user.token });

    const res = await api('/me/reminders', { token: user.token });
    assert.deepEqual(res.body.eventIds, [eventId]);

    await api(path, { method: 'DELETE', token: user.token });
    const after = await api('/me/reminders', { token: user.token });
    assert.deepEqual(after.body.eventIds, []);
  });

  it('returns 404 for an event that does not exist', async () => {
    const res = await api('/events/999999/reminder', { method: 'PUT', token: user.token });
    assert.equal(res.status, 404);
  });
});
