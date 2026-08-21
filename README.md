# Binance Historical Data Downloader

A lightweight Node.js utility to fetch and sync 1-minute historical candle data ($1\text{m}$ OHLCV) from Binance Spot and Futures REST APIs directly to your local file system.

## Key Features

* **Dual Market Support:** Works seamlessly with both Binance Spot and USDT-M Futures APIs.
* **Smart Incremental Sync:** Auto-detects local files and appends only the newest candles since the last execution.
* **Full $1\text{m}$ Granularity:** Downloads complete 1-minute historical kline data.
* **Rate-Limit Safe:** Automatically handles pagination and API weight limits to prevent IP bans.

---

Data is saved as JSONL files structured by market type and symbol.
