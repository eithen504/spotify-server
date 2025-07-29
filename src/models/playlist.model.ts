import { model, Schema, Types } from "mongoose"
import { GENRES } from "../constants";

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
      ref: "User", // reference to the User model
      required: true,
    },
    genre: [
      {
        type: String,
        enum: GENRES,
      }
    ],
    tracks: [
      {
        type: Types.ObjectId,
        ref: "Track", // reference to the Track model
        default: null,
      }
    ]
  },
  { timestamps: true }
);

const Playlist = model("Playlist", playlistSchema);
export default Playlist;
