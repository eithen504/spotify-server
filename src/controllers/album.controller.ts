import { Request, Response } from "express"
import { v2 as cloudinary } from 'cloudinary'
import Album from "../models/album.model";
import Track from "../models/track.model";
import Like from "../models/like.model";
import SaveAlbum from "../models/save.album.model";

const uploadAlbum = async (req: Request, res: Response) => {
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
        console.error("Error in uploadAlbum:", error)
        res.status(500).json({ errorMessage: "Internal server error" });
    }
}

const getAlbumTracks = async (req: Request, res: Response) => {
    const { id } = req.params;
    const currentUser = (req as any).user;

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

        console.log("track", tracks);

        const trackIds = tracks.map(track => track._id);
        const likes = await Like.find({
            userId: currentUser?._id,
            trackId: { $in: trackIds }
        });

        const likedTrackIds = new Set(likes.map(like => like?.trackId?.toString()));

        const tracksWithLikes = tracks.map(track => ({
            _id: track._id,
            title: track.title,
            coverImageUrl: track.coverImageUrl,
            audioUrl: track.audioUrl,
            artist: track.artist,
            duration: track.duration,
            albumId: track.albumId,
            albumName: album.title,
            languages: track.languages,
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
        res.status(500).json({ errorMessage: "Internal server error" });
    }
}

const updateAlbum = async (req: Request, res: Response) => {
    const { payload: { title, coverImageUrl } } = req.body;
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

        // Update album
        const album = await Album.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true } // return updated doc
        );

        if (!album) {
            return res.status(404).json({ errorMessage: "Album not found" });
        }

        res.status(200).json(album);
    } catch (error) {
        console.error("Error in updateAlbum:", error);
        res.status(500).json({ errorMessage: "Internal server error" });
    }
};

export {
    uploadAlbum,
    getAlbumTracks,
    updateAlbum
}