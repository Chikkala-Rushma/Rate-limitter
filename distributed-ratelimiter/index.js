import express from "express";
import {connectRedis} from "./config/redisClient.js";
import router from "./routes/apiRoutes.js";
import rateLimiter from "./middleware/ratelimiter.js";
import { loadRedisScripts } from "./redis/scriptLoader.js";
import {fileURLToPath} from "url";

const app = express();
console.log(process.cwd(),"current working directory");
console.log(import.meta)
console.log(fileURLToPath(import.meta.url),"file url to path")

app.use(express.json());
app.use(rateLimiter);
app.use("/api", router);

async function startServer() {
      await connectRedis();
      await loadRedisScripts();

    app.listen(3000, () => {
        console.log("Server running on 3000");
    });
}

startServer().catch((err) => {
    console.error("Error starting server:", err);
    process.exit(1);
})


  
