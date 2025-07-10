export function isLoggedIn(): boolean {
  return document.cookie
    .split(";")
    .some((item) => item.trim().startsWith("JWT="));
}

export function LogOut(): void {
  document.cookie = "JWT=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  window.location.href = "/";
}
