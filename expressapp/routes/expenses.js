import express from "express";
import MongoHandler from '../Mongo/MongoHandler.js';


const router = express.Router();
const mongoHandler = new MongoHandler();

router.post("/new", async function (req, res) {
  const sessionToken = req.get('x-session');
  const [username, sessionId] = Buffer.from(sessionToken, 'base64').toString().split('|');
  const entry = req.body;
  entry['timestamp'] = new Date().toISOString();
  entry['username'] = username;
  try {
    const objectId = await mongoHandler.insertToCosts(entry);
    res.send({
      success: true,
      objectId
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
    })
  }
});

router.post("/delete", async function (req, res) {
  const sessionToken = req.get('x-session');
  const [username, sessionId] = Buffer.from(sessionToken, 'base64').toString().split('|');
  const { id } = req.body;

  if (!id) {
    res.status(500).send({
      success: false,
      error: "Missing 'id' parameter in body"
    });
  }

  try {
    const what = await mongoHandler.removeFromCosts(id, username);
    res.send({
      success: true,
      what
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error
    })
  }
});

router.get("/", async function (req, res) {
  const sessionToken = req.get('x-session');
  const [username, sessionId] = Buffer.from(sessionToken, 'base64').toString().split('|');
  const { filter } = req.query;
  try {
    const expenses = !filter || filter === 'all' ? await mongoHandler.getFromCosts(username) : await mongoHandler.getFromCostsByCategory(username, filter);
    res.send({
      success: true,
      expenses,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error
    })
  }
});


export default router;
