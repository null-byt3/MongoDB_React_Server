import express from "express";
import { authenticate, validate } from "../bin/authenticator.js";

const router = express.Router();


router.post('/', async (req, res) => {
  const { success, sessionId, error } = await authenticate(req.body.username, req.body.password);
  if (success === true) {
    res.send({ success: true, sessionId });
  } else {
    res.status(403).send({ success: false, error })
  }
});

router.get('/', async (req, res) => {
  const sessionToken = req.get('x-session');
  const [username, sessionId] = Buffer.from(sessionToken, 'base64').toString().split('|');
  if (!username || !sessionId) {
    res.status(403).send({ success: false, error: 'Invalid Cookie' });
    return;
  }
  const { success, error } = await validate(username, sessionId);
  if (!success) {
    res.status(403).send({ success: false, error });
    return;
  }
  res.send({ success: true })
  return;
})

export default router;
