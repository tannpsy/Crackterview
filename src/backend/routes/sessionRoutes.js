import express from "express";
import { CreateSession, GetMySessions, GetSessionById, DeleteSession } from "../controllers/sessionController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();
router.post("/create", authMiddleware, CreateSession)
router.post("/sessions", authMiddleware, GetMySessions)
router.post("/:id", authMiddleware, GetSessionById)
router.post("/:id", authMiddleware, DeleteSession)