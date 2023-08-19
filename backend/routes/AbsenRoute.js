import express from "express";
import {
  getAbsen,
  getAbsenId,
  createAbsen,
  updateAbsen,
  deleteAbsen,
  upload,
} from "../controllers/Absen.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/absens", verifyUser, getAbsen);
router.get("/absens/:id", verifyUser, getAbsenId);
router.post("/absens", verifyUser, upload, createAbsen);
router.patch("/absens/:id", verifyUser, updateAbsen);
router.delete("/absens:id", verifyUser, deleteAbsen);

export default router;
