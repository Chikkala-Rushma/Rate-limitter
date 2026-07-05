import { createClient } from "redis";
const redisClient = createClient({
  url: "redis://localhost:6379",
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

async function connectRedis() {
    try{
       await redisClient.connect();
       console.log("Connected to Redis");

    }catch(err){
        console.error("Error connecting to Redis:", err);
        throw err;
    }
   
}


export {redisClient, connectRedis};