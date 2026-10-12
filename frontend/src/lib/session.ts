export const TOKEN_COOKIE = "events_board_token";

export function readToken() {
  const match = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${TOKEN_COOKIE}=`));
  return match ? decodeURIComponent(match.slice(TOKEN_COOKIE.length + 1)) : null;
}

export function writeToken(token: string | null) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";

  if (token) {
    document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; SameSite=Lax${secure}`;
  } else {
    document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax${secure}`;
  }
}
