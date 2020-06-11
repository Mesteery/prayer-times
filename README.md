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

#### PrayerManager :
* **Interface :**
  * `getTimes (date: Date | [year: number, month: number, day: number] | timestamp: number, coords: [lat: number, lng: number, elevation?: number], timeZone?: number | 'auto', dst?: 0 | 1 | 'auto', timeFormat?: '24h' | '12h' | '12hNS' | 'Float'): Prayer[]` : get prayer times for the given day
  * `getMonthTimes ([year: number, month: number], coords: [lat: number, lng: number, elevation?: number], timeZone?: number | 'auto', est?: 0 | 1 | 'auto', timeFormat?: '24h' | '12h' | '12hNS' | 'Float'): Prayer[][]` : get prayer times for the given month of specified year
  * `getYearTimes (year: number, coords: [lat: number, lng: number, elevation?: number], timeZone?: number | 'auto', dst?: 0 | 1 | 'auto', timeFormat?: '24h' | '12h' | '12hNS' | 'Float'): Prayer[][][]` : get prayer times for the given year
  * `method: any (see code)` : get calculation method
  * `method(method: 'MWL' | 'ISNA' | 'MF' | 'Egypt' | 'Makkah' | 'Karachi' | 'Tehran' | 'Jafari' | 'JAKIM'): void` : set calculation method 
  * `adjust(parameters): void` : adjust calculation parameters	
  * `tune(offsets): void` : tune times by given offsets 
  * `getSetting(): any (see code)` : get current calculation parameters
  * `getOffsets(): any (see code)` : get current time offsets

#### Prayer
* **Properties :**
  * [static] `TimesNames: object`: A object of prayers identifier and it's name
  * `name: string`: The identifier of the prayer
  * `formatted: string`: The formatted prayer time
  * `date: Date`: The **Date** of the prayer (**in UTC**)
____
* **Calculation Methods :**
  * `MWL`: Muslim World League : (Fajr: 18, Isha: 17)
  * `ISNA`: Islamic Society of North America (ISNA) : (Fajr: 15, Isha: 15)
  * `MF`: Muslims of France (MF) : (Fajr: 12, Isha: 12)
  * `Egypt`: Egyptian General Authority of Survey, : (Fajr: 19.5, Isha: 17.5)
  * `Makkah`: Umm Al-Qura University : (Fajr: 18.5, Isha: '90 min')
  * `Karachi`: University of Islamic Sciences, Karachi (Fajr: 18, Isha: 18)
  * `Tehran`: Institute of Geophysics, University of Tehran : (Fajr: 17.7, Isha: 14, Maghrib: 4.5, Midnight: 'Jafari')
  * `Jafari`: Shia Ithna-Ashari, Leva Institute, Qum : (Fajr: 16, Isha: 14, Maghrib: 4, Midnight: 'Jafari')
  * `JAKIM`: Jabatan Kemajuan Islam Malaysia : (Fajr: 20, Isha: 18)

* **Examples :**

**Browser**
```html
<script src="https://cdn.jsdelivr.net/npm/prayer-times.js@1.6.9/dist/index.min.js"></script>
<script>
  const prayTimes = new PrayerTimes.PrayerManager('MWL')
  let lat = 43
  let lng = -80
  let times = prayTimes.getTimes(new Date(), [lat, lng], -5) // Get prayers times for "today" at lat: 43, long: -80 with -5 timezone
  console.log('Sunrise : ', times.find(t => t.name === "sunrise"))
  // OR
  console.log('Sunrise : ', times[2])
</script>
```
**NodeJS**
```js
const { PrayerManager } = require("prayer-times.js")
let prayTimes = new PrayerManager('ISNA')
let lat = 43
let lng = -80
let times = prayTimes.getTimes(new Date(), [lat, lng], -5) // Get prayers times for "today" at lat: 43, long: -80 with -5 timezone
console.log('Sunrise : ', times.find(t => t.name === "sunrise"))
// OR
console.log('Sunrise : ', times[2])
```
```js
const { PrayerManager } = require("prayer-times.js")
let prayTimes = new PrayerManager()
console.log(prayTimes.method) // get the method, this will print MWL because it's the default method
prayTimes.method = "ISNA" // set the method : ISNA
let thisMonthTimes = prayTimes.getMonthTimes([new Date().getFullYear(), new Date().getMonth() + 1 /* WARNING, THE MONTH INDEX MUST BE 1-12 AND NOT 0-11 */], [43, -80]) // Get prayers times for "this month" at lat: 43, long: -80 with auto timezone and auto dst (default values)
console.log('Fajr : ', thisMonthTimes[0][1]) // print fajr Prayer for the first day of this month
console.log(thisMonthTimes[0][1].date) // get the Date of fajr of first day of this month
```
```js
const { PrayerManager } = require("prayer-times.js")
let prayTimes = new PrayerManager()
console.log(prayTimes.getOffsets()) // get the offsets
let thisYearTimes = prayTimes.getTimes(new Date().getFullYear(), [43, -80], 1, 0, "12h") // Get prayers times for "this year" at lat: 43, long: -80 with "1" timezone and 0 dst with 12h time format
console.log('Fajr : ', thisYearTimes[0][0][1]) // print fajr Prayer for the first day of the first month of this year
console.log(thisYearTimes[0][0][1].date) // get the Date of fajr of the first day of the first month of this year
```
