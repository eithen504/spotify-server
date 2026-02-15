import { Request, Response } from "express"
import { v2 as cloudinary } from 'cloudinary'
import Playlist from "../models/playlist.model";
import Track from "../models/track.model";
import Like from "../models/like.model";
import SavePlaylist from "../models/save.playlist.model";
import mongoose from "mongoose";
import { GENRES_ID_TITLE_MAP } from "../constants";
import { GenreId } from "../types";

const getFeedPlaylists = async (req: Request, res: Response) => {
    const adminId = process.env.ADMIN_ID;
    const page = Number(req.query.page) || 1;

    const firstPageLimit = 24;
    const otherPageLimit = 16;

    const limit =
        Number(req.query.limit) ||
        (page === 1 ? firstPageLimit : otherPageLimit);

    let skip = 0;

    if (page === 1) {
        skip = 0;
    } else {
        skip = firstPageLimit + (page - 2) * otherPageLimit;
    }

    try {
        const playlists = await Playlist.find({ userId: adminId })
            .skip(skip)
            .limit(limit);

        res.status(200).json(playlists);
    } catch (error) {
        console.error("Error in getFeedPlaylists:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const getCurrentUserPlaylists = async (req: Request, res: Response) => {
    const currentUser = (req as any).user;

    if (!currentUser) {
        return res.status(401).json({ errorMessage: "Unauthorized" });
    }

    try {
        const playlists = await Playlist.find({ userId: currentUser._id })
            .limit(500);

        return res.status(200).json(playlists);
    } catch (error) {
        console.error("Error in getCurrentUserPlaylists:", error);
        return res.status(500).json({ errorMessage: "Internal server error" });
    }
};

const getRecentPlaylists = async (req: Request, res: Response) => {
    const currentUser = (req as any).user;
    const ids = req.query.ids;
    let playlistIds = Array.isArray(ids) ? ids : [ids];
    let collectionId = "collectionTracks"
    let collectionIndex = -1;

    if (!currentUser) {
        return res.status(401).json({ errorMessage: "Unauthorized" });
    }

    playlistIds = playlistIds.filter((id) => {
        if (id == collectionId) {
            return true;
        }

        return mongoose.Types.ObjectId.isValid(String(id));
    });

    playlistIds = playlistIds.filter((id, index) => {
        if (id == collectionId) {
            collectionIndex = index
            return false;
        }

        return true;
    });

    try {
        // First get all playlists (unordered)
        const playlists = await Playlist.find({
            _id: { $in: playlistIds },
        }).limit(24); // Limit to 24 results

        // Then sort them to match the input array order
        const playlistsMap = new Map(playlists.map(p => [p._id.toString(), p]));
        const orderedPlaylists: any = playlistIds.map(id => playlistsMap.get(id?.toString() || ""))

        if (collectionIndex !== -1) {
            const customCollection = {
                _id: "collectionTracks",
                title: "Liked Tracks",
                coverImageUrl: "https://misc.scdn.co/liked-songs/liked-songs-300.jpg",
                userId: currentUser?._id,
                genres: [],
                tracks: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            orderedPlaylists.splice(collectionIndex, 0, customCollection);
        }

        res.status(200).json(orderedPlaylists);
    } catch (error) {
        console.error("Error in getRecentPlaylists:", error);
        res.status(500).json({ errorMessage: "Internal server error" });
    }
}

const getGenrePlaylists = async (req: Request, res: Response) => {
    const { id } = req.params;
    const genre = GENRES_ID_TITLE_MAP[id as GenreId];

    if (!genre) {
        return res.status(404).json({ error: "Genre not found" });
    }

    try {
        const playlists = await Playlist.find({
            genres: { $in: genre }
        }).limit(200);

        res.status(200).json(playlists);
    } catch (error) {
        console.error("Error in getGenrePlaylists:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const addItemsToPlaylist = async (req: Request, res: Response) => {
    const { payload: { trackIds } } = req.body;
    const { id } = req.params;

    try {
        const playlist = await Playlist.findById(id);
        if (!playlist) {
            res.status(404).json({ errorMessage: "Playlist not found" });
            return;
        }

        const existingTracks = trackIds.filter((id: any) => playlist.tracks.includes(id));

        // Check if playlist already exists
        if (existingTracks.length > 0) {
            res.status(400).json({ errorMessage: "Some tracks already exists in this playlist" });
            return;
        }

        const totalTracks = playlist.tracks.length + trackIds.length;
        if (totalTracks > 30) {
            return res.status(400).json({ errorMessage: "Playlist cannot have more than 30 tracks" });
        }

        playlist.tracks.push(...trackIds);
        await playlist.save();

        res.status(200).json(playlist);
    } catch (error) {
        console.error("Error in addItemToPlaylist:", error);
        res.status(500).json({ errorMessage: "Internal server error" });
    }
};

const uploadPlaylist = async (req: Request, res: Response) => {
    const { payload: { title, coverImageUrl, genres, tracks, visibility } } = req.body;
    const currentUser = (req as any).user;

    try {
        let result;
        if (coverImageUrl) {
            result = await cloudinary.uploader.upload(coverImageUrl);
        }

        const playlist = await Playlist.create({
            title,
            coverImageUrl: result?.secure_url || "",
            userId: currentUser._id,
            genres,
            tracks,
            visibility
        })

        res.status(200).json(playlist);

    } catch (error) {
        console.error("Error in uploadPlaylist:", error)
        res.status(500).json({ errorMessage: "Internal server error" });
    }
}

const getPlaylistTracks = async (req: Request, res: Response) => {
    const { id } = req.params;
    const currentUser = (req as any).user;

    try {
        const playlist = await Playlist.findOne({ _id: id })
            .populate("userId", "displayName") as any;

        if (!playlist) {
            res.status(404).json({ errorMessage: "Playlist not found" });
            return;
        }

        const hasSaved = await SavePlaylist.findOne({
            $and: [
                { userId: currentUser?._id },
                { playlistId: id }
            ]
        });

        const tracks = await Track.find({ _id: { $in: playlist.tracks } }).populate("albumId") as any;

        const trackIds = tracks.map((track: any) => track._id);
        const likes = await Like.find({
            userId: currentUser?._id,
            trackId: { $in: trackIds }
        });

        const likedTrackIds = new Set(likes.map(like => like?.trackId?.toString()));

        const tracksWithLikes = tracks.map((track: any) => ({
            _id: track._id,
            title: track.title,
            coverImageUrl: track.coverImageUrl,
            audioUrl: track.audioUrl,
            artist: track.artist,
            duration: track.duration,
            genre: track.genre,
            albumId: track.albumId._id,
            albumName: track.albumId.title,
            languages: track.languages,
            hasLiked: likedTrackIds.has(track._id.toString()),
            createdAt: track.createdAt,
            updatedAt: track.updatedAt,
        }));

        res.status(200).json({
            playlist: {
                _id: playlist._id,
                title: playlist.title,
                coverImageUrl: playlist.coverImageUrl,
                userId: playlist.userId._id,
                username: playlist.userId.displayName,
                genre: playlist.genre,
                tracks: playlist.tracks,
                hasSaved: hasSaved ? true : false, // Convert to boolean
                createdAt: playlist.createdAt,
                updatedAt: playlist.updatedAt
            },
            tracks: tracksWithLikes
        });

    } catch (error) {
        console.error("Error in getPlaylistTracks:", error);
        res.status(500).json({ errorMessage: "Internal server error" });
    }
}

const updatePlaylist = async (req: Request, res: Response) => {
    const { payload: { title, coverImageUrl, trackIds } } = req.body;
    const { id } = req.params;

    try {
        let uploadImageResult;

        // Upload cover image URL to Cloudinary (if provided)
        if (coverImageUrl) {
            uploadImageResult = await cloudinary.uploader.upload(coverImageUrl);
        }

        // Build update object
        const updateFields: any = {};
        if (title) updateFields.title = title;
        if (uploadImageResult?.secure_url) {
            updateFields.coverImageUrl = uploadImageResult.secure_url;
        }
        if (trackIds) updateFields.tracks = trackIds;

        // Update playlist
        const playlist = await Playlist.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true } // return updated doc
        );

        if (!playlist) {
            return res.status(404).json({ errorMessage: "Playlist not found" });
        }

        res.status(200).json(playlist);
    } catch (error) {
        console.error("Error in updatePlaylist:", error);
        res.status(500).json({ errorMessage: "Internal server error" });
    }
}

export {
    getFeedPlaylists,
    getCurrentUserPlaylists,
    getRecentPlaylists,
    getGenrePlaylists,
    addItemsToPlaylist,
    uploadPlaylist,
    getPlaylistTracks,
    updatePlaylist
}