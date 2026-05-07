const env = require('../config/env');

const ACCESS_COOKIE_NAME = 'ohs_access_token';
const REFRESH_COOKIE_NAME = 'ohs_refresh_token';

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const ACCESS_COOKIE_MAX_AGE = 15 * 60 * 1000;
const REFRESH_COOKIE_MAX_AGE = 7 * ONE_DAY_IN_MS;

const isProduction = env.nodeEnv === 'production';

function parseCookies(headerValue = '') {
  return headerValue.split(';').reduce((cookies, part) => {
    const [rawName, ...rawValue] = part.trim().split('=');

    if (!rawName) {
      return cookies;
    }

    cookies[rawName] = decodeURIComponent(rawValue.join('='));
    return cookies;
  }, {});
}

function getCookie(req, name) {
  const cookies = parseCookies(req.headers.cookie);
  return cookies[name] || null;
}

function getCookieOptions(maxAge) {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
    maxAge,
    path: '/'
  };
}

function setAuthCookies(res, { accessToken, refreshToken }) {
  setAccessCookie(res, accessToken);
  setRefreshCookie(res, refreshToken);
}

function setAccessCookie(res, accessToken) {
  res.cookie(
    ACCESS_COOKIE_NAME,
    accessToken,
    getCookieOptions(ACCESS_COOKIE_MAX_AGE)
  );
}

function setRefreshCookie(res, refreshToken) {
  res.cookie(
    REFRESH_COOKIE_NAME,
    refreshToken,
    getCookieOptions(REFRESH_COOKIE_MAX_AGE)
  );
}

function clearAuthCookies(res) {
  res.clearCookie(
    ACCESS_COOKIE_NAME,
    getCookieOptions(ACCESS_COOKIE_MAX_AGE)
  );

  res.clearCookie(
    REFRESH_COOKIE_NAME,
    getCookieOptions(REFRESH_COOKIE_MAX_AGE)
  );
}

module.exports = {
  ACCESS_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  getCookie,
  setAuthCookies,
  setAccessCookie,
  clearAuthCookies
};
