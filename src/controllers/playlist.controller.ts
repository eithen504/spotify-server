import { Request, Response } from "express"
import { v2 as cloudinary } from 'cloudinary'
import Playlist from "../models/playlist.model";
import mongoose from "mongoose";
import Track from "../models/track.model";
import Like from "../models/like.model";
import SavePlaylist from "../models/save.playlist.model";
import { GENRES_MAP } from "../constants";

export const uploadPlaylist = async (req: Request, res: Response) => {
    const { payload: { title, coverImageUrl, genre } } = req.body;
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
            genre
        })

        res.status(200).json(playlist);

    } catch (error) {
        console.error("Error in uploadPlaylist:", error)
        res.status(500).json({ error: "Internal server error" });
    }
}

export const savePlaylist = async (req: Request, res: Response) => {
    const { id } = req.body;
    const currentUser = (req as any).user;

    try {
        // Try to delete the playlist first
        const deleteResult = await SavePlaylist.deleteOne({
            userId: currentUser._id,
            playlistId: id
        });

        console.log("dleet one ", deleteResult);

        // If a document was deleted, return false (it existed and we removed it)
        if (deleteResult.deletedCount > 0) {
            res.status(200).json({
                isSaved: false,
            });

            return;
        }

        // If no document was deleted, create a new one
        await SavePlaylist.create({
            userId: currentUser._id,
            playlistId: id
        });

        res.status(200).json({
            isSaved: true,
        });

    } catch (error) {
        console.error("Error in savePlaylist:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getFeedPlaylists = async (req: Request, res: Response) => {
    const adminId = process.env.ADMIN_ID

    try {
        const playlists = await Playlist.find({ userId: adminId })
            .limit(24); // Limit to 24 results

        res.status(200).json(playlists);
    } catch (error) {
        console.error("Error in getFeedPlaylists:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getMyPlaylists = async (req: Request, res: Response) => {
    const currentUser = (req as any).user;
    console.log("we are here", currentUser);


    try {
        const playlists = await Playlist.find({ userId: currentUser._id })
            .limit(24); // Limit to 24 results

        res.status(200).json(playlists);
    } catch (error) {
        console.error("Error in getMyPlaylists:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getRecentPlaylists = async (req: Request, res: Response) => {
    const ids = req.query.ids;
    const playlistIds = Array.isArray(ids) ? ids : [ids];

    try {
        // First get all playlists (unordered)
        const playlists = await Playlist.find({
            _id: { $in: playlistIds },
        }).limit(24); // Limit to 24 results

        // Then sort them to match the input array order
        const playlistsMap = new Map(playlists.map(p => [p._id.toString(), p]));
        const orderedPlaylists = playlistIds
            .map(id => playlistsMap.get(id?.toString() || ""))
            .filter(p => p !== undefined); // Filter out any not found

        res.status(200).json(orderedPlaylists);
    } catch (error) {
        console.error("Error in getRecentPlaylists:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMySavedPlaylists = async (req: Request, res: Response) => {
    const currentUser = (req as any).user;

    try {
        const playlists = await SavePlaylist.find({ userId: currentUser._id })
            .populate("playlistId")
            .limit(24) as any;  // Moved "as any" to the end if you really need it

        const playlistIds = playlists.map((playlist: any) => ({
            _id: playlist.playlistId?._id,
            title: playlist.playlistId?.title,
            coverImageUrl: playlist.playlistId?.coverImageUrl,
            userId: playlist.playlistId?.userId,
            genre: playlist.playlistId?.genre,
            tracks: playlist.playlistId?.tracks,
            hasSaved: true,
            createdAt: playlist.createdAt,
            updatedAt: playlist.updatedAt,
        }));


        res.status(200).json(playlistIds);

    } catch (error) {
        console.error("Error in getMyPlaylists:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getPlaylistTracks = async (req: Request, res: Response) => {
    const { id } = req.params;
    const currentUser = (req as any).user;

    // ✅ Validate ObjectId first
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: "Invalid playlist ID" });
        return;
    }

    try {
        const playlist = await Playlist.findOne({ _id: id });
        const hasSaved = await SavePlaylist.findOne({
            $and: [
                { userId: currentUser?._id },
                { playlistId: id }
            ]
        });

        if (!playlist) {
            res.status(404).json({ message: "Playlist not found" });
            return;
        }

        const tracks = await Track.find({ _id: { $in: playlist.tracks } }).populate("albumId") as any;

        const trackIds = tracks.map((track: any) => track._id);
        const likes = await Like.find({
            userId: currentUser?._id,
            trackId: { $in: trackIds }
        });

        const likedTrackIds = new Set(likes.map(like => like?.trackId?.toString()));

        const tracksWithLikes = tracks.map((track: any) => ({
            id: track._id,
            title: track.title,
            coverImageUrl: track.coverImageUrl,
            audioUrl: track.audioUrl,
            artist: track.artist,
            duration: track.duration,
            genre: track.genre,
            albumId: track.albumId._id,
            albumName: track.albumId?.title,
            hasLiked: likedTrackIds.has(track._id.toString()),
            createdAt: track.createdAt,
            updatedAt: track.updatedAt,
        }));

        res.status(200).json({
            playlist: {
                _id: playlist._id,
                title: playlist.title,
                coverImageUrl: playlist.coverImageUrl,
                userId: playlist.userId,
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
        res.status(500).json({ error: "Internal server error" });
    }
}


export const getGenrePlaylists = async (req: Request, res: Response) => {
    const adminId = process.env.ADMIN_ID
    const { id } = req.params
    const title = GENRES_MAP[id]
    console.log("title", title);
    

    try {
      const playlists = await Playlist.find({
    userId: adminId,
    genre: { $in: [title] }  // Explicitly check if title is in the genre array
}).limit(24);
        res.status(200).json(playlists);
    } catch (error) {
        console.error("Error in getGenrePlaylists:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}