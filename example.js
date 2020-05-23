const PrayerTimes = require("prayer-times.js")
let prayTimes = new PrayerTimes('ISNA')
let times = prayTimes.getTimes(new Date(), [43, -80], -5) // Get prayers times for "today" at lat: 43, long: -80 with -5 timezone
console.log('Sunrise : '+ times.sunrise)

console.log(prayTimes.method) // get the method, this will print MWL because it's the default method
prayTimes.method = "MWL" // set the method to MWL
let thisMonthTimes = prayTimes.getMonthTimes(new Date().getFullYear(), new Date().getMonth(), [43, -80], 'auto', 'auto') // Get prayers times for "this month" at lat: 43, long: -80 with auto timezone and dst
console.log('Asr : '+ thisMonthTimes[0].times.asr) // print fajr time for the first day of month
console.log("First Day of the Month Timestamp : "+thisMonthTimes[0].date) // get the timestamp of the first day of month

console.log(prayTimes.getOffsets()) // get the offsets
let thisYearTimes = prayTimes.getYearTimes(new Date().getFullYear(), [43, -80], 'auto', 'auto', "12h") // Get prayers times for "this year" at lat: 43, long: -80 with auto timezone and dst with 12h time format
console.log('Fajr : ' + thisYearTimes[0][0].times.fajr) // print fajr time for the first day of the first month
console.log("First Day Of the Year Timestamp : " + thisYearTimes[0][0].date) // get the timestamp of the first day of the first month
