const BASE_URL = 'http://localhost:8000/api/v1';

const getAccessToken = () => localStorage.getItem('access_token');
const getRefreshToken = () => localStorage.getItem('refresh_token');

const saveTokens = (access, refresh) => {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
};

const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

const apiFetch = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getAccessToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  // If 401, try refreshing the token once
  if (response.status === 401) {
    const refreshed = await refreshTokens();
    if (refreshed) {
      headers['Authorization'] = `Bearer ${getAccessToken()}`;
      response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
    } else {
      clearTokens();
      window.location.href = '/signin';
      return;
    }
  }

  return response;
};

export const signUp = async (fullName, email, password) => {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ full_name: fullName, email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Signup failed');

  saveTokens(data.access_token, data.refresh_token);
  return data;
};

export const signIn = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Invalid email or password');

  saveTokens(data.access_token, data.refresh_token);

  localStorage.setItem('user', JSON.stringify(data.user));

  console.log(data.user);

  return data;
};

export const signOut = async () => {
  await apiFetch('/auth/signout', { method: 'POST' });
  clearTokens();
};

export const getMe = async () => {
  const res = await apiFetch('/auth/me');
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Failed to fetch user');
  return data;
};

const refreshTokens = async () => {
  const refresh = getRefreshToken();
  if (!refresh) return false;

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refresh }),
  });

  if (!res.ok) return false;

  const data = await res.json();
  saveTokens(data.access_token, data.refresh_token);
  return true;
};

export const isLoggedIn = () => !!getAccessToken();
