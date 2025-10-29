import express from 'express'
import { protectRoute } from '../middlewares/auth.middleware';
import { likeTrack, getLikedTracks } from '../controllers/like.controller';

const router = express.Router()

// Custom route

// Standard CRUD operations for like
router.post("/:id", protectRoute, likeTrack);
router.get("/", protectRoute, getLikedTracks);

export default router  