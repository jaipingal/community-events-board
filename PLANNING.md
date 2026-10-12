# Planning

This file tracks the FyerX "Community Events Board" assignment: what was asked, how it was built, and what is still open.

## 1. Requirements

The numbers follow the assignment email. Everything in this section is implemented and checked.

### A. Admin

| # | Requirement | How it is done |
|---|---|---|
| 1 | Admin login, with admin pages and APIs protected on the server | One seeded admin (`backend/prisma/seed.js`). Admin APIs go through `authenticate` and `requireAdmin`. Admin pages are checked by `frontend/src/proxy.ts` before they are sent. |
| 2 | Add an event with title, category, city, date and time, price, description and image URL | `POST /admin/events` and the `NewEventForm` page, validated with Zod on the server |
| 3 | Make an event Active or Inactive, never delete it | `PATCH /admin/events/:id/status` and the Activate/Deactivate button in `AdminEventsList` |

### B. Visitors

| # | Requirement | How it is done |
|---|---|---|
| 4 | Only active, upcoming events, nearest first | `listEvents` in `event.service.js` and the `/events` page |
| 5 | Category, city and text filters that work together, with pagination | One combined Prisma query, `EventsExplorer` and `Pagination` |
| 6 | Signup and login with email and password, login returns a JWT | `auth.service.js` with bcrypt and jsonwebtoken, `/signup` and `/login` pages |
| 7 | After login the user picks favourite categories | `/preferences`. New users go there after signup, and so does a first login with no favourites. |
| 8 | My Feed shows upcoming events from those categories | `GET /me/feed` and the `/feed` page |
| 9 | "Remind me" on each event: changes at once, stays saved, rolls back with a message on failure | `ReminderButton` on every card and on the event page, `/events/:id/reminder` |

### C. Event Card Designer

| # | Requirement | How it is done |
|---|---|---|
| 10 | 3 themes, 5 stickers, up to 3 added and removable | `CardDesigner`. The 3-sticker limit is also enforced in `cardDesign.validator.js`. |
| 10 | Live card with a smooth animation | Theme cross-fade and sticker pop-in |
| 10 | Saved for that event and still there after refresh | `/events/:id/card-design`, one row per user and event |

### D. Quality

| Requirement | How it is done |
|---|---|
| Web pages call the project's own JSON API | Every request goes through `frontend/src/lib/api.ts` |
| Polished on phone and laptop, with consistent colours, spacing and fonts | Tailwind with shared components and breakpoints |
| Loading, empty and error states | `StatusMessage` and `Alert`, used on every data screen |
| Prices like `₹1,50,000`, dates like `Sat, 18 Oct, 6:30 PM` | `frontend/src/lib/format.ts`, shown in IST |
| 15 sample events with inactive, past, several categories and cities | `backend/prisma/seed.js` |
| Nothing extra | Two small additions exist only because a required screen needs them: the admin events list (to toggle status) and `/events/cities` (for the city filter). |

## 2. Approach

- **Separate API.** Express serves a JSON API under `/api/v1`. The Next.js app is just a client of it, so a mobile app could use the same endpoints.
- **Backend layers.** Routes map URLs, controllers handle HTTP, services hold the database logic, and Zod schemas validate input. Every error has the same JSON shape.
- **Database first.** A Prisma schema with one migration per table, then a seed.
- **Auth.** Passwords are hashed with bcrypt. The JWT is sent in the `Authorization` header. `authenticate` loads the user from the database, and `requireAdmin` guards the whole admin router.
- **Admin pages.** The token is also kept in a cookie, so `proxy.ts` can ask the API for the user's role before returning an `/admin` page.
- **Frontend state.** Redux Toolkit holds the logged-in user. Page data comes from a small `useAsyncData` hook, which gives each screen its loading, empty and error states.
- **Reminders.** The button flips at once and goes back with a message if the request fails. The lists fetch all reminder ids in one request instead of one per card.

## 3. Completed work

1. **Setup:** project structure, environment files, health endpoint that checks the database.
2. **Database:** Prisma schema, six migrations, seed with 15 events and the admin.
3. **Auth:** signup, login, JWT, auth and admin middleware.
4. **Events:** create, status toggle, public listing with combined filters and pagination.
5. **Personalisation:** favourite categories, feed, reminders.
6. **Card designer:** card design API and the designer on the event page.
7. **UI:** responsive layout, shared components, application states, hover effects.
8. **Tests and checks:** 29 API tests, 11 UI tests, lint on both apps, production build.
9. **Review against the email**, which led to these fixes:
   - `/admin` pages are now blocked on the server. Before, only the browser checked.
   - "Remind me" now appears on every card, not only on the event page.
   - New users are sent to pick favourite categories.
   - The feed's empty message now tells "no favourites picked" apart from "nothing upcoming".
   - The README short answers were cut to 4 lines each.

## 4. Pending

- [ ] Look through the app in a browser at phone and laptop widths.
- [ ] Commit the changes in sensible steps and push to GitHub.
- [ ] Record the 3 to 4 minute demo on a phone-size and a laptop-size screen, and explain two or three choices in your own words.
- [ ] Reply to the HR email.
- [ ] Be ready to explain every file in the live call.

## 5. Known gaps

- Events cannot be edited or deleted (not in the brief).
- Reminders are saved, but no notification is sent.
- The token cookie is not `HttpOnly`. A production version would set an `HttpOnly` cookie from the API.
- There is no rate limiting on login and signup.
- Text search uses `ILIKE`. With much more data it needs a `pg_trgm` or full-text index.
