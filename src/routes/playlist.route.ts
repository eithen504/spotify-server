import express from 'express'
import { protectRoute } from '../middlewares/auth.middleware';
import { getFeedPlaylists, getGenrePlaylists, getMyPlaylists, getMySavedPlaylists, getPlaylistTracks, getRecentPlaylists, savePlaylist, uploadPlaylist } from '../controllers/playlist.controller';

const router = express.Router()

router.post("/uploadPlaylist", protectRoute, uploadPlaylist);
router.post("/savePlaylist", protectRoute, savePlaylist);
router.get("/getFeedPlaylists", getFeedPlaylists);
router.get("/getMyPlaylists", protectRoute, getMyPlaylists);
router.get("/getMySavedPlaylists", protectRoute, getMySavedPlaylists);
router.get("/getPlaylistTracks/:id", protectRoute, getPlaylistTracks);
router.get("/getRecentPlaylists", protectRoute, getRecentPlaylists);
router.get("/getGenrePlaylists/:id", getGenrePlaylists);


export default router  