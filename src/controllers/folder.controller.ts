import { Request, Response } from "express"
import Folder from "../models/folder.model";
import Playlist from "../models/playlist.model";

const getCurrentUserFolders = async (req: Request, res: Response) => {
    const currentUser = (req as any).user;

    try {
        if (!currentUser) {
            res.status(404).json({ errorMessage: "Please login/signup" });
            return;
        }

        const folders = await Folder.find({ userId: currentUser._id })
            .limit(24).sort({ createdAt: -1 }); // Limit to 24 results

        res.status(200).json(folders);
    } catch (error) {
        console.error("Error in getCurrentUserFolders:", error);
        res.status(500).json({ errorMessage: "Internal server error" });
    }
}

const addItemToFolder = async (req: Request, res: Response) => {
    const { payload: { playlistId } } = req.body;
    const { id } = req.params;

    try {
        const folder = await Folder.findById(id);
        if (!folder) {
            res.status(404).json({ errorMessage: "Folder not found" });
            return;
        }

        // Check if playlist already exists
        if (folder.playlists.includes(playlistId)) {
            res.status(400).json({ errorMessage: "Playlist already exists in this folder" });
            return;
        }

        const totalPlaylists = folder.playlists.length + 1;
        if (totalPlaylists > 20) {
            return res.status(400).json({ errorMessage: "Folder cannot have more than 20 playlists" });
        }

        folder.playlists.push(playlistId);
        await folder.save();

        res.status(200).json(folder);
    } catch (error) {
        console.error("Error in addItemToFolder:", error);
        res.status(500).json({ errorMessage: "Internal server error" });
    }
};

const uploadFolder = async (req: Request, res: Response) => {
    const { payload: { name, playlistIds } } = req.body;
    const currentUser = (req as any).user;

    try {
        const folder = await Folder.create({
            name: name.trim(),
            userId: currentUser._id,
            playlists: playlistIds || []
        });

        res.status(201).json(folder);
    } catch (error) {
        console.error("Error in uploadFolder:", error);
        res.status(500).json({ errorMessage: "Internal server error" });
    }
};

const getFolderPlaylists = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const folder = await Folder.findOne({ _id: id });

        if (!folder) {
            res.status(404).json({ errorMessage: "Folder not found" });
            return;
        }

        const playlists = await Playlist.find({ _id: { $in: folder.playlists } })

        res.status(200).json(playlists)

    } catch (error) {
        console.error("Error in getFolderPlaylists:", error);
        res.status(500).json({ errorMessage: "Internal server error" });
    }
}

const updateFolder = async (req: Request, res: Response) => {
    const { payload: { name, playlistIds } } = req.body;
    const { id } = req.params;

    try {
        // Build update object
        const updateFields: any = {};
        if (name) updateFields.name = name;
        if (playlistIds) updateFields.playlists = playlistIds

        // Update playlist
        const folder = await Folder.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true } // return updated doc
        );

        if (!folder) {
            return res.status(404).json({ errorMessage: "Folder not found" });
        }

        console.log("folder", folder);

        res.status(200).json(folder);
    } catch (error) {
        console.error("Error in updateFolder:", error);
        res.status(500).json({ errorMessage: "Internal server error" });
    }
}

const deleteFolder = async (req: Request, res: Response) => {
    const { id } = req.params;

    console.log("if", id);

    try {
        const folder = await Folder.findByIdAndDelete(id);

        if (!folder) {
            return res.status(404).json({ errorMessage: "Folder not found" });
        }

        res.status(200).json(folder);
    } catch (error) {
        console.error("Error in deleteFolder:", error);
        res.status(500).json({ errorMessage: "Internal server error" });
    }
};

export {
    getCurrentUserFolders,
    addItemToFolder,
    uploadFolder,
    getFolderPlaylists,
    updateFolder,
    deleteFolder,
}