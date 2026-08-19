import { getCandleFilePath } from "./candle-file-name.js";
import { pairs } from "./config.js";
import { loadEntireHistory, syncLatestCandles } from "./load-candle-history.js";
import { getCandleFromFile } from "./read-candle-file.js";
import { checkIfCandleDataExist } from "./utils/check-candle-data-file-exists.js";
import { getLastCandleTimestamp } from "./utils/get-last-candle-timestamp.js";
import { writeCandles } from "./write-candle-data.js";

export async function downloadOrsyncHistoricalData() {
    for (const { pair, type } of pairs) {

        const isCandleDataExists = await checkIfCandleDataExist({ pair, type });

        let data;
        if (!isCandleDataExists) {
            data = await loadEntireHistory({ pair, type });
        }
        else {
            const lastestCandleTime = getLastCandleTimestamp({ pair, type })
            const till = lastestCandleTime + 1000 * 60;
            data = await syncLatestCandles({ pair, type, till });
        }

        await writeCandles({ pair, type, candles: data })
    }
}
