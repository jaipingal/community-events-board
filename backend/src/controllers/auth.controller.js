import { createUser, checkCredentials } from '../services/auth.service.js';
import { signToken } from '../utils/token.js';

export const signup = async (req, res, next) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json({ user, token: signToken(user) });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await checkCredentials(req.body);
    res.json({ user, token: signToken(user) });
  } catch (err) {
    next(err);
  }
};

export const me = (req, res) => {
  res.json({ user: req.user });
};
