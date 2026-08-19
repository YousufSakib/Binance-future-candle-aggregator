export function getLastCandleTimestamp({ pair, type }) {
    const bytesToRead = 1024;
    const buffer = Buffer.alloc(bytesToRead);

    const actualBytesToRead = Math.min(fileSize, bytesToRead);
    const startPosition = fileSize - actualBytesToRead;

    fs.readSync(fd, buffer, 0, actualBytesToRead, startPosition);

    const inputString = buffer.toString("utf8");

    const start = inputString.lastIndexOf("[");
    const end = inputString.lastIndexOf("]");
    const lastCandle = JSON.parse(inputString.slice(start, end + 1));

    return Number(lastCandle[0]);

}