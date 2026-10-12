import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { api, startServer, stopServer } from './helpers.js';

describe('public event listing', () => {
  before(startServer);
  after(stopServer);

  it('returns only active, upcoming events in start order', async () => {
    const res = await api('/events?limit=50');
    assert.equal(res.status, 200);

    const { events } = res.body;
    assert.ok(events.length > 0);

    const now = Date.now();
    for (const event of events) {
      assert.equal(event.isActive, true);
      assert.ok(new Date(event.startsAt).getTime() > now);
    }

    const times = events.map((event) => new Date(event.startsAt).getTime());
    assert.deepEqual(times, [...times].sort((a, b) => a - b));
  });

  it('combines category, city and search filters', async () => {
    const res = await api('/events?category=music&city=coimbatore&search=night');
    assert.equal(res.status, 200);
    assert.ok(res.body.events.length > 0);

    for (const event of res.body.events) {
      assert.equal(event.category, 'MUSIC');
      assert.equal(event.city.toLowerCase(), 'coimbatore');
      const text = `${event.title} ${event.description}`.toLowerCase();
      assert.ok(text.includes('night'));
    }
  });

  it('keeps filters applied while paginating', async () => {
    const first = await api('/events?category=music&limit=2&page=1');
    const second = await api('/events?category=music&limit=2&page=2');

    assert.equal(first.body.pagination.page, 1);
    assert.equal(second.body.pagination.page, 2);
    assert.equal(first.body.pagination.total, second.body.pagination.total);

    const firstIds = first.body.events.map((event) => event.id);
    for (const event of second.body.events) {
      assert.equal(event.category, 'MUSIC');
      assert.ok(!firstIds.includes(event.id));
    }
  });

  it('returns an empty page past the last page', async () => {
    const res = await api('/events?page=999');
    assert.equal(res.status, 200);
    assert.deepEqual(res.body.events, []);
  });

  it('rejects invalid query parameters', async () => {
    const res = await api('/events?limit=500&category=art');
    assert.equal(res.status, 400);
    assert.equal(res.body.error.details.length, 2);
  });
});
