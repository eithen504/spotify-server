import express from 'express'
import { protectRoute } from '../middlewares/auth.middleware';
import { uploadAlbum, getAlbumTracks, updateAlbum } from '../controllers/album.controller';

const router = express.Router()

// Standard CRUD operations for playlists
router.post("/", protectRoute, uploadAlbum);
router.get("/:id", protectRoute, getAlbumTracks);
router.patch("/:id", protectRoute, updateAlbum);

export default router 