const { PrayerManager } = require("prayer-times.js");
let prayTimes = new PrayerManager();
console.log(prayTimes.getTimes([2020, 6, 1], [0, 0]))