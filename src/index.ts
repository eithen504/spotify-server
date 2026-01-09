import express, { json } from 'express'
import authRoutes from './routes/auth.route'
import trackRoutes from './routes/track.route'
import playlistRoutes from './routes/playlist.route'
import likeRoutes from './routes/like.route'
import albumRoutes from './routes/album.route'
import savePlaylistRoutes from './routes/save.playlist.route'
import saveAlbumRoutes from './routes/save.album.route'
import folderRoutes from './routes/folder.routes'
import connectToMongoDB from './db/connectToMongoDB'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from "cookie-parser";
import cloudinaryConfig from './config/cloudinary'

dotenv.config()

const app = express()
const port = 3000

app.use(cors({
    origin: [process.env.ALLOWED_ORIGIN as string],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
}))

app.use(json({ limit: '25mb' }))
app.use(cookieParser())

cloudinaryConfig()

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/track", trackRoutes);
app.use("/api/v1/playlist", playlistRoutes);
app.use("/api/v1/like", likeRoutes);
app.use("/api/v1/album", albumRoutes);
app.use("/api/v1/savePlaylist", savePlaylistRoutes);
app.use("/api/v1/saveAlbum", saveAlbumRoutes);
app.use("/api/v1/folder", folderRoutes);

app.listen(port, () => {
    connectToMongoDB()
    console.log(`Example app listening on port ${port}`)
})
