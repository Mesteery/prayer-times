const { PrayerManager } = require("prayer-times.js");
let prayTimes = new PrayerManager();
console.log(prayTimes.getTimes(new Date(), [0, 0]))