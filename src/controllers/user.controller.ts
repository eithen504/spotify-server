import { Request, Response } from "express"
import User from "../models/user.model";
import { v2 as cloudinary } from 'cloudinary'
import Playlist from "../models/playlist.model";
import SavePlaylist from "../models/save.playlist.model";
import Album from "../models/album.model";
import SaveAlbum from "../models/save.album.model";

export const getUserProfile = async (req: Request, res: Response) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId).select("-password");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    } catch (error: any) {
        console.log("Error in getUserProfile controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getMyLibrary = async (req: Request, res: Response) => {
    const currentUser = (req as any).user;

    try {
        const playlists = await Playlist.find({ userId: currentUser._id });

        const saveAlbums = await SaveAlbum.find({ userId: currentUser._id });

        const savePlaylists = await SavePlaylist.find({ userId: currentUser._id })

        res.status(200).json({
            playlists,
            saveAlbums,
            savePlaylists
        });

    } catch (error: any) {
        console.log("Error in getMyLibrary", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateUser = async (req: Request, res: Response) => {
    const { payload: { displayName, avatarUrl, bio } } = req.body;

    const currentUser = (req as any).user;
    const userId = req.params.id;

    try {
        if (currentUser._id.toString() !== userId) {
            res.status(400).json({ message: "You can not update other user profile" });
            return;
        }

        let result;
        if (avatarUrl) {
            result = await cloudinary.uploader.upload(avatarUrl);
        }

        const user = await User.updateOne({ _id: userId }, {
            displayName,
            avatarUrl: result?.secure_url ?? currentUser.avatarUrl,
            bio
        });


        console.log("user", user);

        res.status(200).json(user);

    } catch (error: any) {
        console.log("Error in getUserProfile controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
