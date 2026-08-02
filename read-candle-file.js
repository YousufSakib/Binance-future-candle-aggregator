import fs from "node:fs";
import readline from "node:readline";
import { access } from "node:fs/promises";
import { getCandleFilePath } from "./candle-file-name.js";

export async function getCandleFromFile({ pair, type }) {

    const filePath = getCandleFilePath({ pair, type });


    try {
        await access(filePath);
    } catch {
        return [];
    }

    const rl = readline.createInterface({
        input: fs.createReadStream(filePath),
        crlfDelay: Infinity,
    });

    const candles = [];

    for await (const line of rl) {
        if (!line.trim()) continue;

        const candle = JSON.parse(line);

        candles.push(candle)
    }

    return candles;
}