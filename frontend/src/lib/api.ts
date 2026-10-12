const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const BASE_URL = `${API_URL}/api/v1`;

export type User = {
  id: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
};

export type AuthResponse = {
  user: User;
  token: string;
};

export type FieldError = {
  field: string;
  message: string;
};

export class ApiError extends Error {
  status: number;
  details: FieldError[];

  constructor(status: number, message: string, details: FieldError[] = []) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; token?: string | null } = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  if (options.body) headers["Content-Type"] = "application/json";
  if (options.token) headers.Authorization = `Bearer ${options.token}`;

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method: options.method ?? "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new ApiError(0, "Cannot reach the server. Please try again.");
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const error = data?.error;
    throw new ApiError(
      res.status,
      error?.message ?? "Something went wrong",
      error?.details ?? [],
    );
  }

  return data as T;
}

export async function getHealth(): Promise<{ status: string } | null> {
  try {
    return await request<{ status: string }>("/health");
  } catch {
    return null;
  }
}

export function signup(input: { name: string; email: string; password: string }) {
  return request<AuthResponse>("/auth/signup", { method: "POST", body: input });
}

export function login(input: { email: string; password: string }) {
  return request<AuthResponse>("/auth/login", { method: "POST", body: input });
}

export function getCurrentUser(token: string) {
  return request<{ user: User }>("/auth/me", { token });
}

export type Category = "MUSIC" | "WORKSHOP" | "FOOD" | "SPORTS" | "KIDS";

export type Event = {
  id: number;
  title: string;
  category: Category;
  city: string;
  startsAt: string;
  price: number;
  description: string;
  imageUrl: string;
  isActive: boolean;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type EventList = {
  events: Event[];
  pagination: Pagination;
};

export type EventFilters = {
  category?: string;
  city?: string;
  search?: string;
  page?: number;
  limit?: number;
};

export type NewEvent = {
  title: string;
  category: Category;
  city: string;
  startsAt: string;
  price: number;
  description: string;
  imageUrl: string;
};

function toQueryString(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  const text = query.toString();
  return text ? `?${text}` : "";
}

export function getEvents(filters: EventFilters = {}) {
  return request<EventList>(`/events${toQueryString(filters)}`);
}

export function getEventCities() {
  return request<{ cities: string[] }>("/events/cities");
}

export function getEvent(id: string | number) {
  return request<{ event: Event }>(`/events/${id}`);
}

export function getAdminEvents(token: string, page = 1) {
  return request<EventList>(`/admin/events${toQueryString({ page })}`, { token });
}

export function createEvent(token: string, input: NewEvent) {
  return request<{ event: Event }>("/admin/events", {
    method: "POST",
    body: input,
    token,
  });
}

export function setEventStatus(token: string, id: number, isActive: boolean) {
  return request<{ event: Event }>(`/admin/events/${id}/status`, {
    method: "PATCH",
    body: { isActive },
    token,
  });
}

export function getFavoriteCategories(token: string) {
  return request<{ categories: Category[] }>("/me/favorite-categories", { token });
}

export function saveFavoriteCategories(token: string, categories: Category[]) {
  return request<{ categories: Category[] }>("/me/favorite-categories", {
    method: "PUT",
    body: { categories },
    token,
  });
}

export function getFeed(token: string, page = 1) {
  return request<EventList>(`/me/feed${toQueryString({ page })}`, { token });
}

export function getReminder(token: string, eventId: number | string) {
  return request<{ reminder: boolean }>(`/events/${eventId}/reminder`, { token });
}

export function setReminder(token: string, eventId: number | string, enabled: boolean) {
  return request<{ reminder: boolean }>(`/events/${eventId}/reminder`, {
    method: enabled ? "PUT" : "DELETE",
    token,
  });
}

export type SavedCardDesign = {
  theme: "sunset" | "ocean" | "forest";
  stickers: ("star" | "heart" | "fire" | "music" | "party")[];
};

export function getCardDesign(token: string, eventId: number | string) {
  return request<{ design: SavedCardDesign | null }>(`/events/${eventId}/card-design`, {
    token,
  });
}

export function saveCardDesign(
  token: string,
  eventId: number | string,
  design: SavedCardDesign,
) {
  return request<{ design: SavedCardDesign }>(`/events/${eventId}/card-design`, {
    method: "PUT",
    body: design,
    token,
  });
}
