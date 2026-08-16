export const instruments = {
    future: 1,
    spot: 2
}

export const pairs = [
    {
        type: instruments.future,
        pair: 'BTCUSDT'
    },
    {
        type: instruments.future,
        pair: 'ETHUSDT'
    },
    {
        type: instruments.future,
        pair: 'XRPUSDT'
    },
    {
        type: instruments.future,
        pair: 'TRXUSDT'
    },
    {
        type: instruments.future,
        pair: 'ADAUSDT'
    },
    {
        type: instruments.future,
        pair: 'BNBUSDT'
    },
    {
        type: instruments.future,
        pair: 'SOLUSDT'
    },
    {
        type: instruments.future,
        pair: "DOGEUSDT"
    },
    {
        type: instruments.future,
        pair: "AVAXUSDT"
    },
    {
        type: instruments.future,
        pair: "LINKUSDT"
    },
    {
        type: instruments.future,
        pair: "AAVEUSDT"
    },
    {
        type: instruments.future,
        pair: "FETUSDT"
    }
]

export const dataFolder = {
    future: "futurepairs",
    spot: "spotpairs",
    parent: "historical-candles"
}

