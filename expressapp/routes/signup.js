import express from "express";
import MongoHandler from "../Mongo/MongoHandler.js";
import { authenticate } from "../utils/authenticator.js";

const router = express.Router();
const mongoHandler = new MongoHandler();


router.post('/', async (req, res) => {
  const result = await mongoHandler.createUser(req.body);
  if (!result.success) {
    res.status(403).send({ success: false, error: result.error })
    return;
  }

  const { success, sessionId, error } = await authenticate(req.body.username, req.body.password);
  if (success) {
    res.send({ success: true, sessionId });
    return;
  } else {
    res.status(403).send({ success: false, error })
  }
});

export default router;
