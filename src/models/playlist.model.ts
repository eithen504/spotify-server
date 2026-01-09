import { model, Schema, Types } from "mongoose"
import { GENRE_TITLES, VISIBILITIES } from "../constants";

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
                enum: GENRE_TITLES,
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
