import { Request, Response } from "express"
import { v2 as cloudinary } from 'cloudinary'
import Album from "../models/album.model";
import Track from "../models/track.model";
import Like from "../models/like.model";
import mongoose from "mongoose";
import SaveAlbum from "../models/save.album.model";

export const uploadAlbum = async (req: Request, res: Response) => {
    const { payload: { title, coverImageUrl } } = req.body;

    try {
        let result;
        if (coverImageUrl) {
            result = await cloudinary.uploader.upload(coverImageUrl);
        }

        const album = await Album.create({
            title,
            coverImageUrl: result?.secure_url || "",
        })

        res.status(200).json(album);

    } catch (error) {
        console.error("Error in verifyGoogleToken:", error)
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getAlbumTracks = async (req: Request, res: Response) => {
    const { id } = req.params;
    const currentUser = (req as any).user;

    // ✅ Validate ObjectId first
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: "Invalid album ID" });
        return;
    }

    try {
        const album = await Album.findOne({ _id: id });
        if (!album) {
            res.status(404).json({ message: "Album not found" });
            return;
        }

        const hasSaved = await SaveAlbum.findOne({
            $and: [
                { userId: currentUser?._id },
                { albumId: id }
            ]
        });

        const tracks = await Track.find({ albumId: id });

        const trackIds = tracks.map(track => track._id);
        const likes = await Like.find({
            userId: currentUser?._id,
            trackId: { $in: trackIds }
        });

        const likedTrackIds = new Set(likes.map(like => like?.trackId?.toString()));

        const tracksWithLikes = tracks.map(track => ({
            id: track._id,
            title: track.title,
            coverImageUrl: track.coverImageUrl,
            audioUrl: track.audioUrl,
            artist: track.artist,
            duration: track.duration,
            genre: track.genre,
            albumId: track.albumId,
            albumName: album.title,
            hasLiked: likedTrackIds.has(track._id.toString()),
            createdAt: track.createdAt,
            updatedAt: track.updatedAt,
        }));


        res.status(200).json({
            album: {
                _id: album._id,
                title: album.title,
                coverImageUrl: album.coverImageUrl,
                hasSaved: hasSaved ? true : false, // Convert to boolean
                createdAt: album.createdAt,
                updatedAt: album.updatedAt
            },
            tracks: tracksWithLikes
        });

    } catch (error) {
        console.error("Error in getAlbumTracks:", error)
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getMySavedAlbums = async (req: Request, res: Response) => {
    const currentUser = (req as any).user;

    try {
        const albums = await SaveAlbum.find({ userId: currentUser._id })
            .populate("albumId")
            .limit(24) as any;

        if (!albums) {
            res.status(404).json({ message: "Album not found" });
            return;
        }

        const albumIds = albums.map((album: any) => ({
            _id: album.albumId?._id,
            title: album.albumId?.title,
            coverImageUrl: album.albumId?.coverImageUrl,
            hasSaved: true,
            createdAt: album.createdAt,
            updatedAt: album.updatedAt,
        }));

        res.status(200).json(albumIds);

    } catch (error) {
        console.error("Error in getAlbumTracks:", error)
        res.status(500).json({ error: "Internal server error" });
    }
}

export const saveAlbum = async (req: Request, res: Response) => {
    const { id } = req.body;
    const currentUser = (req as any).user;

    try {
        // Try to delete the album first
        const deleteResult = await SaveAlbum.deleteOne({
            userId: currentUser._id,
            albumId: id
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
        await SaveAlbum.create({
            userId: currentUser._id,
            albumId: id
        });

        res.status(200).json({
            isSaved: true,
        });

    } catch (error) {
        console.error("Error in saveAlbum:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}