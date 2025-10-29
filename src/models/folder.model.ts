import { model, Schema, Types } from "mongoose";

const folderSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        playlists: [
            {
                type: Types.ObjectId,
                ref: "Playlist", // reference to the Playlist model
                default: null,
            }
        ]
    },
    { timestamps: true }
);

const Folder = model('Folder', folderSchema);
export default Folder
