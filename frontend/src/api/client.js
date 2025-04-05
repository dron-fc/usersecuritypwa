const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

async function client(endpoint, { body, ...customConfig } = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}/${endpoint}`, config);

  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.assign('/login');
    return;
  }

  if (!response.ok) {
    const error = await response.text();
    return Promise.reject(error);
  }

  return await response.json();
}

export { client };
