export default function isLoggedIn(): boolean {
  return document.cookie
    .split(";")
    .some((item) => item.trim().startsWith("JWT="));
}
