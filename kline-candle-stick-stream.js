import WebSocket from "ws";

export const CandleCache = [];

const symbol = 'btcusdt';
const interval = '1m'; // 1m, 3m, 5m, 15m, 1h ইত্যাদি ব্যবহার করতে পারেন

const url = `wss://fstream.binance.com/market/ws/${symbol}@kline_${interval}`;

const ws = new WebSocket(url);

ws.on('open', () => {
  console.log(`Connected to Binance Kline Stream for ${symbol.toUpperCase()} (${interval})...\n`);
});

ws.on('message', (data) => {
  try {
    const raw = JSON.parse(data);
    const k = raw.k;

    const candleData = {
      eventType: raw.e,                                 // Event Type (kline)
      eventTime: new Date(raw.E).toLocaleTimeString(),  // Event Time
      symbol: raw.s,                                    // Symbol
      startTime: new Date(k.t).toLocaleTimeString(),    // Kline Start Time
      closeTime: new Date(k.T).toLocaleTimeString(),    // Kline Close Time
      interval: k.i,                                    // Interval (e.g. 1m)
      firstTradeId: k.f,                                // First Trade ID
      lastTradeId: k.L,                                 // Last Trade ID
      openPrice: parseFloat(k.o),                       // Open Price
      closePrice: parseFloat(k.c),                      // Close Price (Current Live Price)
      highPrice: parseFloat(k.h),                       // High Price
      lowPrice: parseFloat(k.l),                        // Low Price
      volumeBase: parseFloat(k.v),                      // Base Asset Volume (BTC)
      tradesCount: k.n,                                 // Total Number of Trades
      isClosed: k.x,                                    // Is Candle Closed? (true/false)
      volumeQuote: parseFloat(k.q),                     // Quote Asset Volume (USDT)
      takerBuyBaseVolume: parseFloat(k.V),              // Taker Buy Base Asset Volume
      takerBuyQuoteVolume: parseFloat(k.Q)              // Taker Buy Quote Asset Volume
    };

    CandleCache.push(candleData);
    printData(candleData);
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
});

ws.on('error', (error) => {
  console.error('WebSocket Error:', error);
});

ws.on('close', () => {
  console.log('Connection closed.');
});



function printData(candleData) {
  console.clear();
  console.log(`================ ${candleData.symbol} (${candleData.interval}) KLINE DATA ================`);
  console.log(`Event Time          : ${candleData.eventTime}`);
  console.log(`Candle Time Window  : ${candleData.startTime} ---> ${candleData.closeTime}`);
  console.log(`Candle Status       : ${candleData.isClosed ? 'CLOSED (New Candle Next)' : 'BUILDING (Live)'}`);
  console.log(`------------------------------------------------------------------`);
  console.log(`Open Price          : $${candleData.openPrice}`);
  console.log(`High Price          : $${candleData.highPrice}`);
  console.log(`Low Price           : $${candleData.lowPrice}`);
  console.log(`Current / Close     : $${candleData.closePrice}`);
  console.log(`------------------------------------------------------------------`);
  console.log(`Total Volume (Base) : ${candleData.volumeBase.toLocaleString()}`);
  console.log(`Total Volume (USDT) : $${candleData.volumeQuote.toLocaleString()}`);
  console.log(`Taker Buy Volume    : ${candleData.takerBuyBaseVolume} BTC ($${candleData.takerBuyQuoteVolume.toLocaleString()})`);
  console.log(`Taker Sell Volume   : ${Number((candleData.volumeBase - candleData.takerBuyBaseVolume)).toFixed(3)} BTC ($${Number((candleData.volumeQuote - candleData.takerBuyQuoteVolume).toFixed(3)).toLocaleString()})`);
  console.log(`Total Trades Count  : ${candleData.tradesCount}`);
  console.log(`Trade ID Range      : ${candleData.firstTradeId} ---> ${candleData.lastTradeId}`);
  console.log(`==================================================================`);

}