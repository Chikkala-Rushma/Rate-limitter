import fs from "fs/promises";
import path from "path";
import redisService from "./redisService.js";
import { registerScript } from "./scriptRegistry.js";

export async function loadRedisScripts() {

    const scriptsDir = path.join(import.meta.dirname, "../scripts");

    const files = await fs.readdir(scriptsDir);

    const luaFiles = files.filter(file => file.endsWith(".lua"));

    const promises = luaFiles.map(async (file) => {

        const filePath = path.join(scriptsDir, file);

        const script = await fs.readFile(filePath, "utf8");

        const sha = await redisService.loadScript(script);

        const name = path.parse(file).name;

        registerScript(name, sha, script);

        console.log(`✓ ${name} -> ${sha}`);

    });

    await Promise.all(promises);

    console.log("All Redis scripts loaded.");
}