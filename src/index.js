const DMath = {
  dtr(d) { return (d * Math.PI) / 180.0; },
  rtd(r) { return (r * 180.0) / Math.PI; },
  sin(d) { return Math.sin(this.dtr(d)); },
  cos(d) { return Math.cos(this.dtr(d)); },
  tan(d) { return Math.tan(this.dtr(d)); },
  arcsin(d) { return this.rtd(Math.asin(d)); },
  arccos(d) { return this.rtd(Math.acos(d)); },
  arctan(d) { return this.rtd(Math.atan(d)); },
  arccot(x) { return this.rtd(Math.atan(1 / x)); },
  arctan2(y, x) { return this.rtd(Math.atan2(y, x)); },
  fixAngle(a) { return this.fix(a, 360); },
  fixHour(a) { return this.fix(a, 24); },
  fix(a, b) {
    a = a - b * (Math.floor(a / b));
    return (a < 0) ? a + b : a;
  }
}

class Prayer {
  static TimeNames = {
    imsak: 'Imsak',
    fajr: 'Fajr',
    sunrise: 'Sunrise',
    dhuhr: 'Dhuhr',
    asr: 'Asr',
    sunset: 'Sunset',
    maghrib: 'Maghrib',
    isha: 'Isha',
    midnight: 'Midnight'
  }
  constructor (name, date, formatted) {
    this.name = name;
    this.date = date;
    this.formatted = formatted;
  }
}

class PrayerManager {
  /**
   * Create a PrayerManager
   * @param {string} [method=MWL] The calculation method to calculate prayer times
   */
  constructor(method = "MWL") {
    this._method = method
    
    this.methods = {
      MWL: {
        name: 'Muslim World League',
        params: { fajr: 18, isha: 17 }
      },
      ISNA: {
        name: 'Islamic Society of North America (ISNA)',
        params: { fajr: 15, isha: 15 }
      },
      MF: {
        name: 'Muslims of France (MF)',
        params: { fajr: 12, isha: 12 }
      },
      Egypt: {
        name: 'Egyptian General Authority of Survey',
        params: { fajr: 19.5, isha: 17.5 }
      },
      Makkah: {
        name: 'Umm Al-Qura University, Makkah',
        params: { fajr: 18.5, isha: '90 min' }
      }, // fajr was 19 degrees before 1430 hijri
      Karachi: {
        name: 'University of Islamic Sciences, Karachi',
        params: { fajr: 18, isha: 18 }
      },
      Tehran: {
        name: 'Institute of Geophysics, University of Tehran',
        params: { fajr: 17.7, isha: 14, maghrib: 4.5, midnight: 'Jafari' }
      }, // isha is not explicitly specified in this method
      Jafari: {
        name: 'Shia Ithna-Ashari, Leva Institute, Qum',
        params: { fajr: 16, isha: 14, maghrib: 4, midnight: 'Jafari' }
      },
      JAKIM: {
        name: 'Jabatan Kemajuan Islam Malaysia',
        params: { fajr: 20, isha: 18 }
      }
    }
    this.defaultParams = {
      maghrib: '0 min',
      midnight: 'Standard'
    }
    this.setting = {
      imsak: '10 min',
      dhuhr: '0 min',
      asr: 'Standard',
      highLats: 'NightMiddle'
    }
    this.timeFormat = '24h'
    this.timeSuffixes = ['am', 'pm']
    this.invalidTime = '---'
    this.numIterations = 1
    this.offset = {}
    this.lat
    this.lng
    this.elv
    this.timeZone
    this.jDate;
    this.defParams = this.defaultParams;
    for (const i in this.methods) {
      this.params = this.methods[i].params;
      for (let j in this.defParams)
        if ((typeof(this.params[j]) == 'undefined'))
          this.params[j] = this.defParams[j];
    }
    this.calcMethod = this.methods[method] ? method : "MWL";
    this.params = this.methods[this.calcMethod].params;
    this.adjust(this.params)
    for (const i in Prayer.TimeNames) this.offset[i] = 0;
  }

  set method(method) {
    if (this.methods[String(method)]) {
      this.adjust(this.methods[method].params);
      this.calcMethod = method;
    } else throw new Error("The method " + method + " doesn't exists")
  }
  get method() {
    return this.calcMethod;
  }
  adjust(params) {
    for (const id in params) this.setting[id] = params[id];
  }
  tune(timeOffsets) {
    for (const i in timeOffsets) this.offset[i] = timeOffsets[i];
  }
  getSetting() {
    return this.setting;
  }
  getOffsets() {
    return this.offset;
  }
  getDefaults() {
    return this.methods;
  }

  /**
   * Get the prayer times for a specific date
   * @param {([number, number, number]|Date|number)} [date=new Date()] The date you want prayer times ([year, month, day] or Date or timestamp)
   * @param {[number, number, number]} coords The coordinates at which you want the prayer times (elevation is optionnal)
   * @param {number|"auto"} [timezone=auto] The timezone
   * @param {(1|0|"auto")} [dst=auto"] The Daylight Saving Times
   * @param {("24h"|"12h"|"12hNS"|"Float")} [format=24h] The ouput format of prayer times
   * @returns {Prayer[]} A array of prayer times
   */
  getTimes(date = new Date(), coords, timezone = 'auto', dst = 'auto', format = '24h') {
    this.lat = Number(coords[0]);
    this.lng = Number(coords[1]);
    this.elv = coords[2] ? Number(coords[2]) : 0;
    this.timeFormat = format || this.timeFormat;
    if (typeof date === "number") date = new Date(date)
    if (date instanceof Date) date = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
    if (timezone === 'auto') timezone = this.getTimeZone(date);
    if (dst === 'auto') dst = this.getDst(date);
    this.timeZone = Number(timezone) + (Number(dst) ? 1 : 0);
    this.jDate = this.julian(date[0], date[1], date[2]) - this.lng / (15 * 24);
    
    return this.computeTimes(date);
  }

  /**
   * Get all prayer times for a specific month of a year (month index must start at 1)
   * @param {[number, number]} date The month and year you want prayer times
   * @param {[number, number, number]} coords The coordinates at which you want prayer times (elevation is optionnal)
   * @param {string} [timezone=auto] The timezone
   * @param {string} [dst=auto] The Daylight Saving Time
   * @param {string} [format=24h] The output format of prayer times
   * @returns {Prayer[][]} A array of array of prayer times
   */
  getMonthTimes([year, month], coords, timezone, dst, format) {
    year = Number(year)
    month = Number(month)

    return [...Array(new Date(year, month, 0).getDate())].map((_, d) => this.getTimes(new Date(year, month, d + 1), coords, timezone, dst, format));
  }
  /**
   * Get all prayer times for a specific year
   * @param {number} year The year you want prayer times
   * @param {[number, number, number]} coords The coordinates at which you want prayer times (elevation is optionnal)
   * @param {string} [timezone="auto"] The timezone
   * @param {string} [dst="auto"] The Daylight Saving Time
   * @param {string} [format="24h"] The output format of prayer times
   * @returns {Prayer[][][]} A array of array of array of prayer times
   */
  getYearTimes(year, coords, timezone, dst, format) {
    if (typeof year !== "number") throw new Error("The year argument must be a number")
    return [...Array(12)].map((_, m) => this.getMonthTimes([year, m + 1], coords, timezone, dst, format))
  }
  getFormattedTime(time, format, suffixes) {
    if (isNaN(time)) return this.invalidTime;
    if (format === 'Float') return time;
    suffixes = suffixes || this.timeSuffixes;

    time = DMath.fixHour(time + 0.5 / 60); // add 0.5 minutes to round
    let hours = Math.floor(time);
    let minutes = Math.floor((time - hours) * 60);
    let suffix = (format === '12h') ? suffixes[hours < 12 ? 0 : 1] : '';
    let hour = (format === '24h') ? this.twoDigitsFormat(hours) : ((hours + 12 - 1) % 12 + 1);
    return hour + ':' + this.twoDigitsFormat(minutes) + (suffix ? ' ' + suffix : '');
  }

  midDay(time) {
    let eqt = this.sunPosition(this.jDate + time).equation;
    let noon = DMath.fixHour(12 - eqt);
    return noon;
  }
  sunAngleTime(angle, time, direction) {
    let decl = this.sunPosition(this.jDate + time).declination;
    let noon = this.midDay(time);
    let t = 1 / 15 * DMath.arccos((-DMath.sin(angle) - DMath.sin(decl) * DMath.sin(this.lat)) / (DMath.cos(decl) * DMath.cos(this.lat)));
    return noon + (direction === 'ccw' ? -t : t);
  }

  asrTime(factor, time) {
    let decl = this.sunPosition(this.jDate + time).declination;
    let angle = -DMath.arccot(factor + DMath.tan(Math.abs(this.lat - decl)));
    return this.sunAngleTime(angle, time);
  }
  sunPosition(jd) {
    let D = jd - 2451545.0;
    let g = DMath.fixAngle(357.529 + 0.98560028 * D);
    let q = DMath.fixAngle(280.459 + 0.98564736 * D);
    let L = DMath.fixAngle(q + 1.915 * DMath.sin(g) + 0.020 * DMath.sin(2 * g));

    let R = 1.00014 - 0.01671 * DMath.cos(g) - 0.00014 * DMath.cos(2 * g);
    let e = 23.439 - 0.00000036 * D;

    let RA = DMath.arctan2(DMath.cos(e) * DMath.sin(L), DMath.cos(L)) / 15;
    let equation = q / 15 - DMath.fixHour(RA);
    let declination = DMath.arcsin(DMath.sin(e) * DMath.sin(L));

    return { declination, equation };
  }
  julian(year, month, day) {
    if (month <= 2) {
      year -= 1;
      month += 12;
    }
    let A = Math.floor(year / 100);
    let B = 2 - A + Math.floor(A / 4);

    let JD = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
    return JD;
  }
  computePrayerTimes(times) {
    times = this.dayPortion(times);
    let params = this.setting;
    let imsak = this.sunAngleTime(this.eval(params.imsak), times.imsak, 'ccw');
    let fajr = this.sunAngleTime(this.eval(params.fajr), times.fajr, 'ccw');
    let sunrise = this.sunAngleTime(this.riseSetAngle(), times.sunrise, 'ccw');
    let dhuhr = this.midDay(times.dhuhr);
    let asr = this.asrTime(this.asrFactor(params.asr), times.asr);
    let sunset = this.sunAngleTime(this.riseSetAngle(), times.sunset);
    let maghrib = this.sunAngleTime(this.eval(params.maghrib), times.maghrib);
    let isha = this.sunAngleTime(this.eval(params.isha), times.isha);

    return {
      imsak,
      fajr,
      sunrise,
      dhuhr,
      asr,
      sunset,
      maghrib,
      isha
    };
  }
  computeTimes(date) {
    // default times
    let times = {
      imsak: 5,
      fajr: 5,
      sunrise: 6,
      dhuhr: 12,
      asr: 13,
      sunset: 18,
      maghrib: 18,
      isha: 18
    };
    for (let i = 1; i <= this.numIterations; i++) times = this.computePrayerTimes(times);

    times = this.adjustTimes(times);
    times.midnight = (this.setting.midnight === 'Jafari') ? times.sunset + this.timeDiff(times.sunset, times.fajr) / 2 : times.sunset + this.timeDiff(times.sunset, times.sunrise) / 2;
        
    times = this.tuneTimes(times);
    return this.modifyFormats(times, date);
  }
  adjustTimes(times) {
    let params = this.setting;
    for (const i in times) times[i] += this.timeZone - this.lng / 15;
        
    if (params.highLats !== 'None') times = this.adjustHighLats(times);
        
    if (this.isMin(params.imsak)) times.imsak = times.fajr- this.eval(params.imsak) / 60;
    if (this.isMin(params.maghrib)) times.maghrib = times.sunset + this.eval(params.maghrib) / 60;
    if (this.isMin(params.isha)) times.isha = times.maghrib + this.eval(params.isha) / 60;
    
    times.dhuhr += this.eval(params.dhuhr) / 60; 
  
    return times;
  }
  asrFactor(asrParam) {
    return { Standard: 1, Hanafi: 2 }[asrParam] || this.eval(asrParam);
  }
  riseSetAngle() {
    //let earthRad = 6371009; // in meters
    //let angle = DMath.arccos(earthRad/(earthRad+ elv));
    let angle = 0.0347 * Math.sqrt(this.elv); // an approximation
    return 0.833 + angle;
  }
  tuneTimes(times) {
    
    for (const i in times) times[i] += this.offset[i] / 60;
    return times;
  }
  modifyFormats(times, [year, month, day]) {
    const prayers = []
    for (const i in times) {
      let formatted = this.getFormattedTime(times[i], this.timeFormat)
      if (formatted === this.invalidTime) prayers.push(new Prayer(i, null, formatted));
      else {
        let time = DMath.fixHour(times[i] + 0.5 / 60);
        let hours = Math.floor(time);
        prayers.push(new Prayer(i, new Date(year, month - 1, day, hours, Math.floor((time - hours) * 60), 0, 0), formatted));
      }
    }
    return prayers;
  }
  adjustHighLats(times) {
    let params = this.setting;
    let nightTime = this.timeDiff(times.sunset, times.sunrise);

    times.imsak = this.adjustHLTime(times.imsak, times.sunrise, this.eval(params.imsak), nightTime, 'ccw');
    times.fajr = this.adjustHLTime(times.fajr, times.sunrise, this.eval(params.fajr), nightTime, 'ccw');
    times.isha = this.adjustHLTime(times.isha, times.sunset, this.eval(params.isha), nightTime);
    times.maghrib = this.adjustHLTime(times.maghrib, times.sunset, this.eval(params.maghrib), nightTime);

    return times;
  }
  adjustHLTime(time, base, angle, night, direction) {
    let portion = this.nightPortion(angle, night);
    let timeDiff = (direction == 'ccw') ? this.timeDiff(time, base) : this.timeDiff(base, time);
    if (isNaN(time) || timeDiff > portion) time = base + (direction == 'ccw' ? -portion : portion);
    return time;
  }
  nightPortion(angle, night) {
    let method = this.setting.highLats;
    let portion = 1 / 2 // MidNight
    if (method == 'AngleBased') portion = 1 / 60 * angle;
    if (method == 'OneSeventh') portion = 1 / 7;
    return portion * night;
  }
  dayPortion(times) {
    for (const i in times) times[i] /= 24;
    return times;
  }
  getTimeZone(date) {
    let year = date[0];
    let t1 = this.gmtOffset([year, 0, 1]);
    let t2 = this.gmtOffset([year, 6, 1]);
    return Math.min(t1, t2);
  }
  getDst(date) {
    return Number(this.gmtOffset(date) != this.getTimeZone(date));
  }
  gmtOffset(date) {
    let localDate = new Date(date[0], date[1] - 1, date[2], 12, 0, 0, 0);
    let GMTString = localDate.toGMTString();
    let GMTDate = new Date(GMTString.substring(0, GMTString.lastIndexOf(' ') - 1));
    let hoursDiff = (localDate - GMTDate) / (1000 * 60 * 60);
    return hoursDiff;
  }
  eval(str) {
    return Number(String(str).split(/[^0-9.+-]/)[0]);
  }
  isMin(arg) {
    return String(arg).indexOf('min') !== -1;
  }
  timeDiff(time1, time2) {
    return DMath.fixHour(time2 - time1);
  }
  twoDigitsFormat(num) {
    return (num < 10) ? '0' + num : num;
  }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = { PrayerManager, Prayer };
} else if (typeof define === 'function' && define.amd) {
  define([], () => ({ PrayerManager, Prayer }));
} else {
  window.PrayerTimes = { PrayerManager, Prayer };
}