import { pairs } from "./config.js";
import { getReadableTime } from "./get-readable-time.js";
import { getCandleFromFile } from "./read-candle-file.js";

function isValidNumberArr(arr) {
    return arr.every(value =>
        typeof value === "number"
            ? Number.isFinite(value)
            : typeof value === "string" &&
            value.trim() !== "" &&
            Number.isFinite(Number(value))
    );
}

export async function getCandleValidationReport() {
    const reports = [];
    let totalFaults = 0;
    for (const { pair, type } of pairs) {
        const candles = await getCandleFromFile({ pair, type });

        const report = {
            pair,
            type,
            hasWhitespace: false,
            isAscdSorted: true,
            newestCandleTime: candles[0][0],
            oldestCandleTime: candles[0][0],
            totalCandles: candles.length,
            allFieldsOk: true,
            numberOfFaults: 0
        }

        let previousTime = candles[0][0];

        for (let i = 1; i < candles.length; i++) {
            let currentTime = candles[i][0];

            if (previousTime > currentTime) {
                report.isAscdSorted = false;
                report.numberOfFaults++;
            }

            if (previousTime + 60000 !== currentTime) {
                console.log(`${previousTime}; ${currentTime}`)
                report.hasWhitespace = true;
                report.numberOfFaults++;
            }

            if (!isValidNumberArr(candles[i])) {
                report.allFieldsOk = false;
                report.numberOfFaults++;
                console.log(candles[i]);
            }

            report.oldestCandleTime = Math.min(report.oldestCandleTime, currentTime);
            report.newestCandleTime = Math.max(report.newestCandleTime, currentTime);

            previousTime = currentTime;
        }

        if (report.oldestCandleTime !== candles[0][0]) {
            report.numberOfFaults++;
        }
        if (report.newestCandleTime !== candles.at(-1)[0]) {
            report.numberOfFaults++;
        }

        report.oldestCandleTime = getReadableTime(new Date(report.oldestCandleTime));
        report.newestCandleTime = getReadableTime(new Date(report.newestCandleTime));

        reports.push(report);
        totalFaults += report.numberOfFaults;
    }
    return { summary: totalFaults > 0 ? `${totalFaults} total faults!` : 'Okay', pairs: reports }
}