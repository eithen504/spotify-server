import express from 'express'
import { protectRoute } from '../middlewares/auth.middleware';
import {
    getFeedPlaylists,
    getCurrentUserPlaylists,
    getRecentPlaylists,
    getGenrePlaylists,
    addItemsToPlaylist,
    uploadPlaylist,
    getPlaylistTracks,
    updatePlaylist
} from '../controllers/playlist.controller';

const router = express.Router()

// Custom route
router.get("/feed", getFeedPlaylists);
router.get("/me", protectRoute, getCurrentUserPlaylists);
router.get("/recent", protectRoute, getRecentPlaylists);
router.get("/:id/genre", getGenrePlaylists);
router.patch("/:id/items", protectRoute, addItemsToPlaylist);

// Standard CRUD operations for playlist
router.post("/", protectRoute, uploadPlaylist);
router.get("/:id", protectRoute, getPlaylistTracks);
router.patch("/:id", protectRoute, updatePlaylist);

export default router  