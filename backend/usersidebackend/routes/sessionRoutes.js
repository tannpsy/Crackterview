// const express = require('express');
// const {
//   createSession,
//   getSessionById,
//   getMySessions,
//   deleteSession,
// } = require('../controllers/sessionController');
// const { protect } = require('../middlewares/authMiddleware');

import express from "express";
import {
  createSession,
  getSessionById,
  getMySessions,
  deleteSession,
} from "../controllers/sessionController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/create', protect, createSession);
router.get('/my-sessions', protect, getMySessions);
router.get('/:id', protect, getSessionById);
router.delete('/:id', protect, deleteSession);

// module.exports = router;
export default router;