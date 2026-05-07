const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');
const authService = require('../services/authService');
const {
  REFRESH_COOKIE_NAME,
  getCookie,
  setAuthCookies,
  setAccessCookie,
  clearAuthCookies
} = require('../utils/cookies');

const login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body);
  setAuthCookies(res, data.tokens);
  success(res, { user: data.user }, 'Login successful');
});

const registrationOptions = asyncHandler(async (_req, res) => {
  const data = await authService.getRegistrationOptions();
  success(res, data, 'Registration options retrieved');
});

const register = asyncHandler(async (req, res) => {
  const data = await authService.register(req.body);
  setAuthCookies(res, data.tokens);
  success(res, { user: data.user }, 'Registration successful', 201);
});

const refresh = asyncHandler(async (req, res) => {
  const refreshToken = getCookie(req, REFRESH_COOKIE_NAME);
  const data = await authService.refresh({ refreshToken });

  setAccessCookie(res, data.accessToken);

  success(res, null, 'Token refreshed');
});

const logout = asyncHandler(async (req, res) => {
  const refreshToken = getCookie(req, REFRESH_COOKIE_NAME);
  await authService.logout(refreshToken);
  clearAuthCookies(res);
  success(res, null, 'Logout successful');
});

const profile = asyncHandler(async (req, res) => {
  const data = await authService.getProfile(req.user.id);
  success(res, data, 'Profile retrieved');
});

module.exports = {
  login,
  registrationOptions,
  register,
  refresh,
  logout,
  profile
};
