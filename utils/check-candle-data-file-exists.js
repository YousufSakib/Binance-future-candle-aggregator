import fs from "node:fs";
import { access } from "node:fs/promises";
import { getCandleFilePath } from "../candle-file-name.js";

export async function checkIfCandleDataExist({ pair, type }) {
    const filePath = getCandleFilePath({ pair, type });

    try {
        await access(filePath);
    } catch {
        return false;
    }

    const stats = fs.statSync(filePath);
    const fileSize = stats.size;

    return fileSize >= 1024;
}