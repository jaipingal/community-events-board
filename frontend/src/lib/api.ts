const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function getHealth(): Promise<{ status: string } | null> {
  try {
    const res = await fetch(`${API_URL}/api/health`);
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}
