import { model, Schema } from "mongoose";
import { LANGUAGES } from "../constants";

const trackSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        coverImageUrl: {
            type: String,
        },
        audioUrl: {
            type: String,
            required: true,
        },
        artist: {
            type: String,
        },
        duration: {
            type: Number,
        },
        albumId: {
            type: Schema.Types.ObjectId,
            ref: "Album",
            default: null,
        },
        languages: [{
            type: String,
            enum: LANGUAGES,
        }]
    },
    { timestamps: true }
);

const Track = model("Track", trackSchema); // ✅ Use correct model name
export default Track;
