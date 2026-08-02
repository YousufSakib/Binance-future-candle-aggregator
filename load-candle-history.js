import { instruments } from "./config.js";
import { getReadableTime } from "./get-readable-time.js";

async function fetchCandles({ type, symbol, interval, limit, endTime }) {

    let baseUrl;

    switch (type) {
        case instruments.future:
            baseUrl = "https://fapi.binance.com/fapi/v1/klines"
            break;
        case instruments.spot:
            baseUrl = "https://api.binance.com/api/v3/klines"
            break;
        default:
            throw new Error("Unknow instuments type!");

    }
    let url = `${baseUrl}?symbol=${symbol}&interval=${interval}`;

    if (limit) {
        url += `&limit=${limit}`;
    }
    if (endTime) {
        url += `&endTime=${endTime}`;
    }

    const res = await fetch(url);

    const data = await res.json();

    if (!Array.isArray(data)) {
        throw new Error(JSON.stringify(data))
    }

    return data;

}

export async function loadEntireHistory({ type, pair }) {

    const interval = '1m';
    const limit = 1500;

    const candles = await fetchCandles({ type, symbol: pair, interval, limit });

    let endTime = new Date(candles[0][0]).getTime() - 60 * 1000;

    let allCandles = [...candles.slice(0, -1)].reverse();

    let isEnd = false;

    while (!isEnd) {
        let candles;
        try {
            candles = await fetchCandles({ type, symbol: pair, interval, limit, endTime });
        } catch (err) {
            console.log(err.message);
            await new Promise(resolve => setTimeout(resolve, 5000));
            continue;
        }

        if (candles.length == 0) {
            isEnd = true;
            continue;
        }

        endTime = candles[0][0] - 1000 * 60;
        
        console.log(`${pair}; endTime: ${getReadableTime(new Date(endTime))}`)
        candles.reverse();
        allCandles.push(...candles);
    }

    return allCandles.reverse();
}

export async function syncLatestCandles({ pair, type, till }) {
    const interval = '1m';
    const limit = 1500;

    const candles = await fetchCandles({ type, symbol: pair, interval, limit });

    // check-if "till"s value is equal to the current running candle-time;
    if (till === candles.slice(-1)[0][0]) {
        console.log(`${pair}'s candle is already up-to-date`)
        return [];
    }

    let endTime = new Date(candles[0][0]).getTime() - 60 * 1000;

    let allCandles = [];

    let isEnd = false;

    for (let i = candles.length - 2; i >= 0; i--) {
        if (candles[i][0] >= till) {
            allCandles.push(candles[i]);
        } else {
            isEnd = true;
            break;
        }
    }

    while (!isEnd) {
        let candles;
        try {
            candles = await fetchCandles({ type, symbol: pair, interval, limit, endTime });
        } catch (err) {
            console.log(err.message);
            await new Promise(resolve => setTimeout(resolve, 5000));
            continue;
        }

        endTime = candles[0][0] - 1000 * 60;
        
        for (let i = candles.length - 1; i >= 0; i--) {
            if (candles[i][0] >= till) {
                allCandles.push(candles[i]);
            } else {
                break;
            }
        }
    }

    return allCandles.reverse();
}