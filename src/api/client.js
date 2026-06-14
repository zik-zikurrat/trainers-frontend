import { API_BASE } from "../config";

async function request(method, path, body) {
  const opts = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body !== undefined) opts.body = JSON.stringify(body);

  const res = await fetch(API_BASE + path, opts);

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const msg =
      data && (data.error || data.message)
        ? data.error || data.message
        : `HTTP ${res.status}`;
    throw new ApiError(msg, res.status);
  }
  return data;
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export const api = {
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body),
  patch: (path, body) => request("PATCH", path, body),
  delete: (path) => request("DELETE", path),
};


function lowerKeys(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = k.charAt(0).toLowerCase() + k.slice(1);
    out[key] = v;
  }
  return out;
}

export function toList(data) {
  if (!data) return [];
  if (Array.isArray(data)) {
    return data.map(lowerKeys);
  }
  if (typeof data === "object") {
    return Object.entries(data).map(([id, obj]) => {
      const o = lowerKeys(obj);
      if (o.id === undefined) o.id = id;
      return o;
    });
  }
  return [];
}
