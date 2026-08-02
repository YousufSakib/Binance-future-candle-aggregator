import { getCandleFilePath } from "./candle-file-name.js";
import { pairs } from "./config.js";
import { loadEntireHistory, syncLatestCandles } from "./load-candle-history.js";
import { getCandleFromFile } from "./read-candle-file.js";
import { writeCandles } from "./write-candle-data.js";

export async function downloadOrsyncHistoricalData() {
    for(const { pair, type } of pairs) {
        const candles = await getCandleFromFile({ pair, type });

        let data;
        if (candles.length === 0) {
            data = await loadEntireHistory({ pair, type });
        }
        else {
            const till = candles.at(-1)[0] + 1000 * 60;
            data = await syncLatestCandles({ pair, type, till });
        }

        await writeCandles({ pair, type, candles: data })

    }
}
