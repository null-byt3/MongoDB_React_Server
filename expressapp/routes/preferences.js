import express from "express";
import MongoHandler from '../Mongo/MongoHandler.js';

const router = express.Router();
const mongoHandler = new MongoHandler();

router.get("/", async function (req, res) {
  const sessionToken = req.get('x-session');
  const [username, sessionId] = Buffer.from(sessionToken, 'base64').toString().split('|');
  try {
    const { password, firstname, lastname, birthday, maritalStatus } = await mongoHandler.fetchUser(username);
    res.send({
      success: true,
      userData: { username, password, firstname, lastname, birthday, maritalStatus }
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error
    })
  }
});

router.post("/", async function (req, res) {
  const sessionToken = req.get('x-session');
  const [username, sessionId] = Buffer.from(sessionToken, 'base64').toString().split('|');
  try {
    await mongoHandler.updateUser(username, req.body);
    res.send({
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error
    })
  }
});


export default router;
