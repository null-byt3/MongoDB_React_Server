import Cookies from "js-cookie";

export async function fetcher(path, options) {
  const sessionId = Cookies.get('sessionId');
  const userId = Cookies.get('userId');

  if (!userId || !sessionId) {
    return {
      success: false,
      error: 'Invalid Session'
    }
  }

  const encodedSession = btoa(`${userId}|${sessionId}`);

  const res = await fetch(`http://localhost:9000${path}`, {
    headers: {
      'Content-Type': 'application/json',
      'x-session': encodedSession,
    },
    ...options
  })
    .then(response => response.json())
    .catch(err => console.log('fetcher error: ', err.toString()))
  return res;
}

export async function fetcherLogin(credentials) {
  const res = await fetch(`http://localhost:9000/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })
    .then(response => response.json())
    .catch(err => console.log('fetcherLogin error: ', err.toString()))
  return res;
}