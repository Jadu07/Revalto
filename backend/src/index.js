import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js"
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js"
import cors from "cors"
import http from "http";
import { Server } from "socket.io";
import conversationRoutes from "./routes/conversationRoutes.js"
import chatSocket from "./sockets/chatSocket.js";
import { verifySocketToken } from "./middlewares/verifySocketToken.js";
dotenv.config()

const app = express()
const server = http.createServer(app);

const allowedOrigins = [
    "http://localhost:5173",
    "https://revalto.vercel.app"
];

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        credentials: true
    }
})

io.use(verifySocketToken)

app.use(cookieParser())

app.use(express.json({ limit: "10mb" }))

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))


app.use('/', authRoutes)
app.use("/posts", postRoutes);
app.use('/users', userRoutes)
app.use("/conversations", conversationRoutes);

chatSocket(io)

const PORT = process.env.PORT || 3000;

if (process.env.VERCEL) {
    // Vercel serverless environment
    // We need to export the express app for Vercel to handle
    // Note: Socket.IO might have limitations in serverless
} else {
    // Local development or traditional server environment
    server.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on port http://localhost:${PORT}`)
    });
}

// Export a handler for Vercel that uses the HTTP server instance
// This allows Socket.IO to intercept requests before Express
export default (req, res) => {
    server.emit('request', req, res);
};
