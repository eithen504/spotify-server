import { model, Schema } from "mongoose";

const savePlaylistSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        playlistId: {
            type: Schema.Types.ObjectId,
            ref: "Playlist",
        } 
    },
    { timestamps: true }
);

const SavePlaylist = model('SavePlaylist', savePlaylistSchema);
export default SavePlaylist
