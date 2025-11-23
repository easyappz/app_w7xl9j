const TOKEN_KEY = 'authToken';
const MEMBER_KEY = 'authMember';

export function setAuth({ token, member }) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    if (token) {
      window.localStorage.setItem(TOKEN_KEY, token);
    } else {
      window.localStorage.removeItem(TOKEN_KEY);
    }

    if (member) {
      const serializedMember = JSON.stringify(member);
      window.localStorage.setItem(MEMBER_KEY, serializedMember);
    } else {
      window.localStorage.removeItem(MEMBER_KEY);
    }
  } catch (error) {
    // Swallow storage errors but log for debugging
    // eslint-disable-next-line no-console
    console.error('Auth storage error (setAuth):', error);
  }
}

export function clearAuth() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(MEMBER_KEY);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auth storage error (clearAuth):', error);
  }
}

export function getToken() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }

    const token = window.localStorage.getItem(TOKEN_KEY);
    if (!token) {
      return null;
    }

    return token;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auth storage error (getToken):', error);
    return null;
  }
}

export function getMember() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }

    const raw = window.localStorage.getItem(MEMBER_KEY);
    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw);
      return parsed;
    } catch (parseError) {
      // If parsing fails, clear broken data
      window.localStorage.removeItem(MEMBER_KEY);
      // eslint-disable-next-line no-console
      console.error('Auth storage error (getMember parse):', parseError);
      return null;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auth storage error (getMember):', error);
    return null;
  }
}
