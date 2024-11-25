import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connection";
import initBot from "./bot";
import router from "./routes/index";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

dotenv.config();
const PORT = process.env.PORT || 5000;

const MONGODB_URI = process.env.MONGODB_URI || "";
const hostname = process.env.HOSTNAME || "";

const allowedOrigins = [hostname, "http://localhost:3000"];

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set");
}

(async () => {
  await connectDB();

  const app = express();
  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    })
  );

  // for socket io
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
  });

  const bot = await initBot();

  // // Function to emit bot's latency and API latency every second
  const emitLatencies = () => {
    // calculate latencies
    const botLatency = Math.floor(Math.random() * 1000);
    // TODO: fetch real latency instead of a random no lol
    const apiLatency = Math.floor(Math.random() * 1000);

    io.sockets.emit("latencies", { botLatency, apiLatency });
  };

  // Function to emit bot's uptime every second
  const emitUptime = () => {
    try {
      const uptimeInSeconds = process.uptime(); // Get uptime in seconds
      const wholeUptime = Math.floor(uptimeInSeconds); // Round down to whole number
      io.sockets.emit("uptime", wholeUptime); // Emit the uptime to all connected clients
    } catch (error) {
      console.error("Error in emitUptime:", error);
    }
  };

  const emitBotStatus = () => {
    try {
      if (!bot) {
        io.sockets.emit("botStatus", "Not Running");
        return;
      }

      const botStatus = bot.isRunning() ? "Running" : "Not Running";
      io.sockets.emit("botStatus", botStatus);
    } catch (error) {
      console.error("Error in emitBotStatus:", error);
    }
  };
  // Emit latencies every second
  setInterval(emitLatencies, 1000);
  // Emit uptime every second
  setInterval(emitUptime, 1000);
  // Emit bot status every second
  setInterval(emitBotStatus, 1000);

  // catch uncaught exceptions
  process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    console.error("Error Stack:", err.stack);
  });

  app.use(express.json());
  app.use(cookieParser());
  app.use("/api/v1/admin", router());

  app.get("/", (_req, res) => {
    res.send("Hello World!");
  });

  server.listen(PORT, () => {
    console.log("Bot Admin Panel listening on port " + PORT);
  });
})();
