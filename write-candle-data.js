import fs from "node:fs";
import { once } from "node:events";
import { getCandleFilePath } from "./candle-file-name.js";

export async function writeCandles({ type, pair, candles }) {

    const filePath = getCandleFilePath({ pair, type });

    const stream = fs.createWriteStream(filePath, {
        flags: "a",
    });

    for (const candle of candles) {
        if (!stream.write(JSON.stringify(candle) + "\n")) {
            await once(stream, "drain");
        }
    }

    stream.end();
    await once(stream, "finish");
}