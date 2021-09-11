import express from "express";

const router = express.Router();


// const express = require("express");

router.get("/", function (req, res, next) {
  res.send("API is working properly");
});

export default router;
// module.exports = router;
