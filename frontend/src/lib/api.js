import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

// Modern browsers block cookies across different subdomains (e.g. Render's
// *.onrender.com) by default, since they're treated as third-party/cross-site.
// So instead of relying on the auth cookie, we also keep a copy of the login
// token and send it as a Bearer header on every request. The backend accepts
// either the cookie or this header.
const TOKEN_KEY = "hom-token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export const api = axios.create({
  baseURL: API,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function fileUrl(path) {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("/")) return path;
  return `${API}/files/${path}`;
}

export function formatErr(detail) {
  if (detail == null) return "Something went wrong.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((e) => (e?.msg ? e.msg : JSON.stringify(e))).join(" ");
  if (detail?.msg) return detail.msg;
  return String(detail);
}




// import axios from "axios";
// const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
// export const API = `${BACKEND_URL}/api`;

// export const api = axios.create({
//   baseURL: API,
//   withCredentials: true,
// });

// export function fileUrl(path) {
//   if (!path) return "";
//   if (path.startsWith("http") || path.startsWith("/")) return path;
//   return `${API}/files/${path}`;
// }

// export function formatErr(detail) {
//   if (detail == null) return "Something went wrong.";
//   if (typeof detail === "string") return detail;
//   if (Array.isArray(detail))
//     return detail.map((e) => (e?.msg ? e.msg : JSON.stringify(e))).join(" ");
//   if (detail?.msg) return detail.msg;
//   return String(detail);
// }
