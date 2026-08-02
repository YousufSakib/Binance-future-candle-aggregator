import { getReadableTime } from "./get-readable-time.js";

const _a = 1567969080000, a = 1567969140000, b = 1567969200000, c = 1567969260000;

console.log(getReadableTime(new Date(_a)));
console.log(getReadableTime(new Date(a)));
console.log(getReadableTime(new Date(b)));
console.log(getReadableTime(new Date(c)));

