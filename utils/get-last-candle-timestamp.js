import fs from "node:fs";
import { getCandleFilePath } from "../candle-file-name.js";

export function getLastCandleTimestamp({ pair, type }) {

    const filePath = getCandleFilePath({ type, pair });

    const stats = fs.statSync(filePath);
    const fileSize = stats.size;

    const fd = fs.openSync(filePath, 'r');

    const bytesToRead = 1024;
    const buffer = Buffer.alloc(bytesToRead);

    const actualBytesToRead = Math.min(fileSize, bytesToRead);
    const startPosition = fileSize - actualBytesToRead;

    fs.readSync(fd, buffer, 0, actualBytesToRead, startPosition);
    fs.closeSync(fd);

    const inputString = buffer.toString("utf8");

    const start = inputString.lastIndexOf("[");
    const end = inputString.lastIndexOf("]");
    const lastCandle = JSON.parse(inputString.slice(start, end + 1));

    return Number(lastCandle[0]);
}