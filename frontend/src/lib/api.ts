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
