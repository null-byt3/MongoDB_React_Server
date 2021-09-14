import express from "express";
import { authenticate, validate } from "../bin/authenticator.js";

const router = express.Router();


router.post('/', async (req, res) => {
  const { success, sessionId, error } = await authenticate(req.body.username, req.body.password);
  if (success === true) {
    res.send({ authSuccessful: true, sessionId });
  } else {
    res.status(403).send({ authSuccessful: false, error })
  }
});

router.get('/', async (req, res) => {
  const sessionToken = req.get('x-session');
  const [username, sessionId] = Buffer.from(sessionToken, 'base64').toString().split('|');
  if (!username || !sessionId) {
    res.status(403).send({ isValid: false, error: 'Invalid Cookie' });
    return;
  }
  const { success, error } = await validate(username, sessionId);
  if (!success) {
    res.status(403).send({ isValid: false, error });
    return;
  }
  res.send({ isValid: true })
  return;
})

export default router;
