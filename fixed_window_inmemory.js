const express = require('express');
const app = express();
app.use(express.json());

let ipMap = new Map();
const window = 60000; // 1 minute
const limit = 5; // 5 requests
console.log("Efwed")
console.log(__dirname,"directory name");

const ipCLeaner = () => {
    let currentTime = new Date().getTime();
    for(let [ip, data] of ipMap.entries()) {
        if(currentTime - data.firstRequestTime >= window) {
            ipMap.delete(ip);
        }
    }
}
setInterval(ipCLeaner, 10000); // Clean up every 10 seconds

const middleware = (req, res, next) => {
    let ip = req.ip;
    let currentTime = new Date().getTime();

    if (!ipMap.has(ip)) {
        ipMap.set(ip, { firstRequestTime: currentTime, requestCount: 1 });
        return next();
    }

    let data = ipMap.get(ip);
    let timeDifference = currentTime - data.firstRequestTime;
    if (timeDifference >= window) {
        data.firstRequestTime = currentTime;
        data.requestCount = 1;
    } else {
        if (data.requestCount >= limit) {
            return res.status(429).json({status:429,message:"Too many requests"});
        }
        data.requestCount += 1;
    }

    return next();

}

app.post("/api", middleware, (req, res) => {
    res.json({status:200,message:"Request successful"});
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
