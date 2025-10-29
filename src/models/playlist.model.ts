import { model, Schema, Types } from "mongoose"
import { GENRES, VISIBILITIES } from "../constants";

const playlistSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        coverImageUrl: {
            type: String,
        },
        userId: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
        genres: [
            {
                type: String,
                enum: GENRES,
            },
        ],
        tracks: [
            {
                type: Types.ObjectId,
                ref: "Track",
                default: null,
            }
        ],
        visibility: {
            type: String,
            enum: VISIBILITIES,
            default: "Public",
        },
    },
    { timestamps: true }
);

const Playlist = model("Playlist", playlistSchema);
export default Playlist;
