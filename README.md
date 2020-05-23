<div align="center">
  <h1><a href="https://www.npmjs.com/package/prayer-times.js">Prayer Times</a></h1>
  <b><small><a href="http://praytimes.org/wiki/Code_Manual">Original Doc</a></small></b>
  <br />
  <small>From : <a href="http://praytimes.org/">praytimes.org</a></small>
  <br /><br />
  <a href="https://www.npmjs.com/package/prayer-times.js"><img src="https://img.shields.io/npm/v/prayer-times.js.svg" alt="version"/>&nbsp;<img src="https://img.shields.io/npm/dm/prayer-times.js.svg" alt="download/month"/></a>
</div>

___
## Usage

* **Interface :**
  * `getTimes (date: Date | [year: number, month: number, day: number], coordinates: [lat: number, lng: number, elevation: number], timeZone?: number | 'auto', dst?: 0 | 1 | 'auto', timeFormat?: '24h' | '12h' | '12hNS' | 'Float')` : get prayer times for the given day
  * `getMonthTimes (year: number, month: number, coordinates: [lat: number, lng: number, elevation?: number], timeZone?: number | 'auto', est?: 0 | 1 | 'auto', timeFormat?: '24h' | '12h' | '12hNS' | 'Float')` : get prayer times for the given month of specified year
  * `getYearTimes (year: number, coordinates: [lat: number, lng: number, elevation?: number], timeZone?: number | 'auto', dst?: 0 | 1 | 'auto', timeFormat?: '24h' | '12h' | '12hNS' | 'Float')` : get prayer times for the given year
  * `method` : get calculation method
  * `method(method: 'MWL' | 'ISNA' | 'MF' | 'Egypt' | 'Makkah' | 'Karachi' | 'Tehran' | 'Jafari')` : set calculation method 
  * `adjust(parameters)` : adjust calculation parameters	
  * `tune(offsets)` : tune times by given offsets 
  * `getSetting()` : get current calculation parameters
  * `getOffsets()` : get current time offsets

* **Calculation Methods :**
  * `MWL`: Muslim World League : (Fajr: 18, Isha: 17)
  * `ISNA`: Islamic Society of North America (ISNA) : (Fajr: 15, Isha: 15)
  * `MF`: Muslims of France (MF) : (Fajr: 12, Isha: 12)
  * `Egypt`: Egyptian General Authority of Survey, : (Fajr: 19.5, Isha: 17.5)
  * `Makkah`: Umm Al-Qura University : (Fajr: 18.5, Isha: '90 min')
  * `Karachi`: University of Islamic Sciences, Karachi (Fajr: 18, Isha: 18)
  * `Tehran`: Institute of Geophysics, University of Tehran : (Fajr: 17.7, Isha: 14, Maghrib: 4.5, Midnight: 'Jafari')
  * `Jafari`: Shia Ithna-Ashari, Leva Institute, Qum : (Fajr: 16, Isha: 14, Maghrib: 4, Midnight: 'Jafari')

* **Examples :**

**Browser**
```html
<script src="https://cdn.jsdelivr.net/npm/prayer-times.js@1.5.2/index.min.js" integrity="sha384-gt7CthPlJwRTuL1/Fk9c7FjDM1nfWQ87cPM1Jt8ACvPZfPc5r4tDHIE0tOZzqhto" crossorigin="anonymous"></script>
<script>
  const prayTimes = new PrayerTimes('MWL')
  let lat = 43
  let lng = -80
  let times = prayTimes.getTimes(new Date(), [lat, lng], -5) // Get prayers times for "today" at lat: 43, long: -80 with -5 timezone
  console.log('Sunrise : ' + times.sunrise)
</script>
```
**NodeJS**
```js
const PrayerTimes = require("prayer-times.js")
let prayTimes = new PrayerTimes('ISNA')
let lat = 43
let lng = -80
let times = prayTimes.getTimes(new Date(), [lat, lng], -5) // Get prayers times for "today" at lat: 43, long: -80 with -5 timezone
console.log('Sunrise : ' + times.sunrise)
```
```js
const PrayerTimes = require("prayer-times.js")
let prayTimes = new PrayerTimes()
console.log(prayTimes.method) // get the method, this will print MWL because it's the default method
prayTimes.method = "ISNA" // set the method : ISNA
let thisMonthTimes = prayTimes.getMonthTimes(new Date().getFullYear(), new Date().getMonth(), [43, -80], 'auto', 'auto') // Get prayers times for "this month" at lat: 43, long: -80 with auto timezone and dst
console.log('Fajr : ' + thisMonthTimes[0].times.fajr) // print fajr time for the first day of month
console.log(thisMonthTimes[0].date) // get the timestamp of the first day
```
```js
const PrayerTimes = require("prayer-times.js")
let prayTimes = new PrayerTimes()
console.log(prayTimes.getOffsets()) // get the offsets
let thisYearTimes = prayTimes.getTimes(new Date().getFullYear(), [43, -80], 'auto', 'auto', "12h") // Get prayers times for "this year" at lat: 43, long: -80 with auto timezone and dst with 12h time format
console.log('Fajr : ' + thisYearTimes[0][0].times.fajr) // print fajr time for the first day of the first month
console.log(thisYearTimes[0][0].date) // get the timestamp of the first day of the first month
```
