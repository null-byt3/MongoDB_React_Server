import MongoHandler from '../Mongo/MongoHandler.js';

import express from "express";
import { authenticate, validate } from "../bin/authenticator.js";

const router = express.Router();
const MongoInstance = new MongoHandler();


router.post('/', async (req, res) => {
  const { success, sessionId, error } = await authenticate(req.body.username, req.body.password);

  if (success === true) {
    // res.cookie('sessionId', sessionId, { maxAge: 1000 * 60 * 2 });
    // res.cookie('userId', req.body.username, { maxAge: 1000 * 60 * 2 });
    res.send({ authSuccessful: true, sessionId });
  } else {
    res.status(403).send({ authSuccessful: false, error })
  }
});

router.get('/', async (req, res) => {
  const sessionToken = req.get('x-session');
  const [userId, sessionId] = Buffer.from(sessionToken, 'base64').toString().split('|');
  if (!userId || !sessionId) {
    res.status(403).send({ isValid: false, error: 'Invalid Session' });
    return;
  }
  const { success, error } = await validate(userId, sessionId);
  if (!success) {
    res.status(403).send({ isValid: false, error });
    return;
  }
  res.send({ isValid: true })
  return;
})

export default router;
