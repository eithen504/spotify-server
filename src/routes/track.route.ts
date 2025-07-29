import express from 'express'
import { protectRoute } from '../middlewares/auth.middleware';
import { getLikedTracks, getTrack, likeTrack, uploadTrack } from '../controllers/track.controller';

const router = express.Router()

router.get("/getTrack/:id", protectRoute, getTrack);
router.post("/uploadTrack", protectRoute, uploadTrack);
router.post("/likeTrack", protectRoute, likeTrack);
router.get("/getLikedTracks", protectRoute, getLikedTracks);


export default router