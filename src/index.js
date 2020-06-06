class DMath {
  static dtr(d) { return (d * Math.PI) / 180.0; }
  static rtd(r) { return (r * 180.0) / Math.PI; }
  static sin(d) { return Math.sin(this.dtr(d)); }
  static cos(d) { return Math.cos(this.dtr(d)); }
  static tan(d) { return Math.tan(this.dtr(d)); }
  static arcsin(d) { return this.rtd(Math.asin(d)); }
  static arccos(d) { return this.rtd(Math.acos(d)); }
  static arctan(d) { return this.rtd(Math.atan(d)); }
  static arccot(x) { return this.rtd(Math.atan(1 / x)); }
  static arctan2(y, x) { return this.rtd(Math.atan2(y, x)); }
  static fixAngle(a) { return this.fix(a, 360); }
  static fixHour(a) { return this.fix(a, 24); }
  static fix(a, b) {
    a = a - b * (Math.floor(a / b));
    return (a < 0) ? a + b : a;
  }
}
class PrayerTimes {
  constructor(method = "MWL") {
    this._method = method
    this.timeNames = {
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
    for (let i in this.methods) {
      this.params = this.methods[i].params;
      for (let j in this.defParams)
        if ((typeof(this.params[j]) == 'undefined'))
          this.params[j] = this.defParams[j];
    }
    this.calcMethod = this.methods[method] ? method : "MWL";
    this.params = this.methods[this.calcMethod].params;
    for (let id in this.params)
      this.setting[id] = this.params[id];

    for (let i in this.timeNames)
      this.offset[i] = 0;
  }

  set method(method) {
    if (this.methods[method]) {
      this.adjust(this.methods[method].params);
      this.calcMethod = method;
    }
  }
  get method() { return this.calcMethod; }

  adjust(params) {
    for (let id in params)
      this.setting[id] = this.params[id];
  }
  tune(timeOffsets) {
    for (let i in this.timeOffsets)
      this.offset[i] = this.timeOffsets[i];
  }
  getSetting() { return this.setting; }
  getOffsets() { return this.offset; }
  getDefaults() { return this.methods; }
  getTimes(date, coords, timezone = 'auto', dst = 'auto', format = '24h') {
    this.lat = 1 * coords[0];
    this.lng = 1 * coords[1];
    this.elv = coords[2] ? 1 * coords[2] : 0;
    this.timeFormat = format || this.timeFormat;
    if (date.constructor === Date)
      date = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
    if (typeof(timezone) == 'undefined' || timezone == 'auto')
      timezone = this.getTimeZone(date);
    if (typeof(dst) == 'undefined' || dst == 'auto')
      dst = this.getDst(date);
    this.timeZone = 1 * timezone + (1 * dst ? 1 : 0);
    this.jDate = this.julian(date[0], date[1], date[2]) - this.lng / (15 * 24);

    return this.computeTimes();
  }
  getMonthTimes(year, month, coords, timezone, dst, format) {
    return Array(new Date(year, month + 1, 0).getDate()).map((d, i) =>
      ({
        times: this.getTimes(date, coords, timezone, dst, format),
        date: new Date(year, month, i + 1)
      })
    )
  }
  getYearTimes(year, coords, timezone, dst, format) {
    return Array(12).map((m, i) => this.getMonthTimes(year, i + 1, coords, timezone, dst, format))
  }
  getFormattedTime(time, format, suffixes) {
    if (isNaN(time))
      return this.invalidTime;
    if (format == 'Float') return time;
    suffixes = suffixes || this.timeSuffixes;

    time = DMath.fixHour(time + 0.5 / 60); // add 0.5 minutes to round
    let hours = Math.floor(time);
    let minutes = Math.floor((time - hours) * 60);
    let suffix = (format == '12h') ? suffixes[hours < 12 ? 0 : 1] : '';
    let hour = (format == '24h') ? this.twoDigitsFormat(hours) : ((hours + 12 - 1) % 12 + 1);
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
    let t = 1 / 15 * DMath.arccos((-DMath.sin(angle) - DMath.sin(decl) * DMath.sin(this.lat)) /
      (DMath.cos(decl) * DMath.cos(this.lat)));
    return noon + (direction == 'ccw' ? -t : t);
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
    let eqt = q / 15 - DMath.fixHour(RA);
    let decl = DMath.arcsin(DMath.sin(e) * DMath.sin(L));

    return { declination: decl, equation: eqt };
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
      imsak: imsak,
      fajr: fajr,
      sunrise: sunrise,
      dhuhr: dhuhr,
      asr: asr,
      sunset: sunset,
      maghrib: maghrib,
      isha: isha
    };
  }
  computeTimes() {
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
    for (let i = 1; i <= this.numIterations; i++)
      times = this.computePrayerTimes(times);
      times = this.adjustTimes(times);
      times.midnight = (this.setting.midnight == 'Jafari') ?
      times.sunset + this.timeDiff(times.sunset, times.fajr) / 2 :
      times.sunset + this.timeDiff(times.sunset, times.sunrise) / 2;
    times = this.tuneTimes(times);

    return this.modifyFormats(times);
  }
  adjustTimes(times) {
    let params = this.setting;
    for (let i in times)
      times[i] += this.timeZone - this.lng / 15;

    if (params.highLats != 'None')
      times = this.adjustHighLats(times);

    if (this.isMin(params.imsak))
      times.imsak = times.fajr - this.eval(params.imsak) / 60;
    if (this.isMin(params.maghrib))
      times.maghrib = times.sunset + this.eval(params.maghrib) / 60;
    if (this.isMin(params.isha))
      times.isha = times.maghrib + this.eval(params.isha) / 60;
    times.dhuhr += this.eval(params.dhuhr) / 60;

    return times;
  }
  asrFactor(asrParam) {
    let factor = { Standard: 1, Hanafi: 2 } [asrParam];
    return factor || this.eval(asrParam);
  }
  riseSetAngle() {
    //let earthRad = 6371009; // in meters
    //let angle = DMath.arccos(earthRad/(earthRad+ elv));
    let angle = 0.0347 * Math.sqrt(this.elv); // an approximation
    return 0.833 + angle;
  }
  tuneTimes(times) {
    for (let i in times)
      times[i] += this.offset[i] / 60;
    return times;
  }
  modifyFormats(times) {
    for (let i in times)
      times[i] = this.getFormattedTime(times[i], this.timeFormat);
    return times;
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
    let timeDiff = (direction == 'ccw') ?
      this.timeDiff(time, base) :
      this.timeDiff(base, time);
    if (isNaN(time) || timeDiff > portion)
      time = base + (direction == 'ccw' ? -portion : portion);
    return time;
  }
  nightPortion(angle, night) {
    let method = this.setting.highLats;
    let portion = 1 / 2 // MidNight
    if (method == 'AngleBased')
      portion = 1 / 60 * angle;
    if (method == 'OneSeventh')
      portion = 1 / 7;
    return portion * night;
  }
  dayPortion(times) {
    for (let i in times)
      times[i] /= 24;
    return times;
  }
  getTimeZone(date) {
    let year = date[0];
    let t1 = this.gmtOffset([year, 0, 1]);
    let t2 = this.gmtOffset([year, 6, 1]);
    return Math.min(t1, t2);
  }
  getDst(date) {
    return 1 * (this.gmtOffset(date) != this.getTimeZone(date));
  }
  gmtOffset(date) {
    let localDate = new Date(date[0], date[1] - 1, date[2], 12, 0, 0, 0);
    let GMTString = localDate.toGMTString();
    let GMTDate = new Date(GMTString.substring(0, GMTString.lastIndexOf(' ') - 1));
    let hoursDiff = (localDate - GMTDate) / (1000 * 60 * 60);
    return hoursDiff;
  }
  eval(str) {
    return 1 * (str + '').split(/[^0-9.+-]/)[0];
  }
  isMin(arg) {
    return (arg + '').indexOf('min') != -1;
  }
  timeDiff(time1, time2) {
    return DMath.fixHour(time2 - time1);
  }
  twoDigitsFormat(num) {
    return (num < 10) ? '0' + num : num;
  }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = PrayerTimes;
} else if (typeof define === 'function' && define.amd) {
  define([], function() {
    return PrayerTimes;
  });
} else {
  window.PrayerTimes = PrayerTimes;
}
