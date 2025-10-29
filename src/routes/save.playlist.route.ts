import express from 'express'
import { protectRoute } from '../middlewares/auth.middleware';
import { savePlaylist, getCurrentUserSavePlaylists } from '../controllers/save.playlist.controller';

const router = express.Router()

// Custom route

// Standard CRUD operations for playlists
router.post("/:id", protectRoute, savePlaylist);
router.get("/", protectRoute, getCurrentUserSavePlaylists);

export default router  