import express from "express";
import MongoHandler from '../Mongo/MongoHandler.js';
import { getMonthDateRange } from "../utils/reportDataFormatter.js";

const router = express.Router();
const mongoHandler = new MongoHandler();

router.get("/", async function (req, res) {
  const sessionToken = req.get('x-session');
  const [username, sessionId] = Buffer.from(sessionToken, 'base64').toString().split('|');
  const { month } = req.query;

  if (!month || month === 'all') {
    const { success, data } = await getMonthDateRange(username);
  } else {
    const { success, data } = await getMonthDateRange(username, month);
  }


  res.send({
    success: true,
  });

});


export default router;

