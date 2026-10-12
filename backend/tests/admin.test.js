import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  adminToken,
  api,
  createUser,
  futureDate,
  newEventPayload,
  startServer,
  stopServer,
} from './helpers.js';

describe('admin event APIs', () => {
  let admin;
  let user;

  before(async () => {
    await startServer();
    admin = await adminToken();
    user = (await createUser()).token;
  });
  after(stopServer);

  it('rejects requests without a token', async () => {
    const res = await api('/admin/events', { method: 'POST', body: newEventPayload() });
    assert.equal(res.status, 401);
  });

  it('rejects a token that is not valid', async () => {
    const res = await api('/admin/events', { token: 'not.a.token' });
    assert.equal(res.status, 401);
  });

  it('blocks normal users from every admin route', async () => {
    const list = await api('/admin/events', { token: user });
    const create = await api('/admin/events', {
      method: 'POST',
      body: newEventPayload(),
      token: user,
    });
    const status = await api('/admin/events/1/status', {
      method: 'PATCH',
      body: { isActive: false },
      token: user,
    });

    assert.equal(list.status, 403);
    assert.equal(create.status, 403);
    assert.equal(status.status, 403);
  });

  it('validates the event payload', async () => {
    const res = await api('/admin/events', {
      method: 'POST',
      token: admin,
      body: newEventPayload({
        title: 'x',
        category: 'ART',
        startsAt: futureDate(-1),
        price: -1,
        imageUrl: 'ftp://nope',
      }),
    });

    assert.equal(res.status, 400);
    const fields = res.body.error.details.map((detail) => detail.field);
    for (const field of ['title', 'category', 'startsAt', 'price', 'imageUrl']) {
      assert.ok(fields.includes(field), `expected an error for ${field}`);
    }
  });

  it('lets an admin create an event and toggle its status', async () => {
    const created = await api('/admin/events', {
      method: 'POST',
      body: newEventPayload(),
      token: admin,
    });
    assert.equal(created.status, 201);

    const id = created.body.event.id;
    assert.equal(created.body.event.isActive, true);
    assert.equal((await api(`/events/${id}`)).status, 200);

    const off = await api(`/admin/events/${id}/status`, {
      method: 'PATCH',
      body: { isActive: false },
      token: admin,
    });
    assert.equal(off.status, 200);
    assert.equal(off.body.event.isActive, false);

    assert.equal((await api(`/events/${id}`)).status, 404);
    const listed = await api('/events?search=Test%20Event&limit=50');
    assert.ok(!listed.body.events.some((event) => event.id === id));

    const adminView = await api('/admin/events?limit=50', { token: admin });
    assert.ok(adminView.body.events.some((event) => event.id === id));

    const on = await api(`/admin/events/${id}/status`, {
      method: 'PATCH',
      body: { isActive: true },
      token: admin,
    });
    assert.equal(on.body.event.isActive, true);
    assert.equal((await api(`/events/${id}`)).status, 200);
  });

  it('returns 404 when changing the status of a missing event', async () => {
    const res = await api('/admin/events/999999/status', {
      method: 'PATCH',
      body: { isActive: true },
      token: admin,
    });
    assert.equal(res.status, 404);
  });
});
