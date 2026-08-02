import { mkdir } from "node:fs/promises";
import { dataFolder } from "./config.js";
import { downloadOrsyncHistoricalData } from "./driver.js";
import { getCandleValidationReport } from "./candle-validation.js";

// check every-folder exists

for (const [attr, value] of Object.entries(dataFolder)) {
    if (attr === 'parent') continue;

    await mkdir(`./${dataFolder.parent}/${value}`, {
        recursive: true,
    });
}

await downloadOrsyncHistoricalData();

const report = await getCandleValidationReport();

console.log(report);