import express from "express";
import MongoHandler from '../Mongo/MongoHandler.js';


const router = express.Router();
const mongoHandler = new MongoHandler();

router.post("/new", async function (req, res) {
  const sessionToken = req.get('x-session');
  const [username, sessionId] = Buffer.from(sessionToken, 'base64').toString().split('|');
  console.log('Got request to add entry')


  const entry = req.body;
  entry['username'] = username;
  entry['timestamp'] = new Date().toISOString();
  const objectId = await mongoHandler.insertEntryToCollection("costs", entry);

  res.send({
    success: true,
    objectId
  })
});

export default router;
