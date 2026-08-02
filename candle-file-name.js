import { dataFolder, instruments } from "./config.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function getCandleFileName({ pair, type }) {
    const fileName = `${pair}-1m.jsonl`
    return fileName;
}

export function getCandleFilePath({ pair, type }) {
    const fileName = getCandleFileName({ pair, type });

    const dir = path.dirname(fileURLToPath(import.meta.url));
    let dataChildFolder;

    switch(type){
        case instruments.future: 
            dataChildFolder = dataFolder.future;
            break;
        default:
            throw new Error("Unknow instuments type!");
    }

    const filePath = path.resolve(dir, `./${dataFolder.parent}/${dataChildFolder}/${fileName}`);

    return filePath;

}