import express, { json } from 'express'
import authRoutes from './routes/auth.route'
import userRoutes from './routes/user.route'
import trackRoutes from './routes/track.route'
import albumRoutes from './routes/album.route'
import playlistRoutes from './routes/playlist.route'
import connectToMongoDB from './db/connectToMongoDB'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from "cookie-parser";
import cloudinaryConfig from './config/cloudinary'

dotenv.config()

const app = express()
const port = 3000

app.use(cors({
    origin: ['https://spotify-six-indol.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // if you want to send cookies
}))

app.use(json({ limit: '15mb' }))
app.use(cookieParser())

cloudinaryConfig()

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/track", trackRoutes);
app.use("/api/v1/album", albumRoutes);
app.use("/api/v1/playlist", playlistRoutes);

app.listen(port, () => {
    connectToMongoDB()
    console.log(`Example app listening on port ${port}`)
})
