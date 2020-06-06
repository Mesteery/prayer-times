"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DMath = /*#__PURE__*/function () {
  function DMath() {
    _classCallCheck(this, DMath);
  }

  _createClass(DMath, null, [{
    key: "dtr",
    value: function dtr(d) {
      return d * Math.PI / 180.0;
    }
  }, {
    key: "rtd",
    value: function rtd(r) {
      return r * 180.0 / Math.PI;
    }
  }, {
    key: "sin",
    value: function sin(d) {
      return Math.sin(this.dtr(d));
    }
  }, {
    key: "cos",
    value: function cos(d) {
      return Math.cos(this.dtr(d));
    }
  }, {
    key: "tan",
    value: function tan(d) {
      return Math.tan(this.dtr(d));
    }
  }, {
    key: "arcsin",
    value: function arcsin(d) {
      return this.rtd(Math.asin(d));
    }
  }, {
    key: "arccos",
    value: function arccos(d) {
      return this.rtd(Math.acos(d));
    }
  }, {
    key: "arctan",
    value: function arctan(d) {
      return this.rtd(Math.atan(d));
    }
  }, {
    key: "arccot",
    value: function arccot(x) {
      return this.rtd(Math.atan(1 / x));
    }
  }, {
    key: "arctan2",
    value: function arctan2(y, x) {
      return this.rtd(Math.atan2(y, x));
    }
  }, {
    key: "fixAngle",
    value: function fixAngle(a) {
      return this.fix(a, 360);
    }
  }, {
    key: "fixHour",
    value: function fixHour(a) {
      return this.fix(a, 24);
    }
  }, {
    key: "fix",
    value: function fix(a, b) {
      a = a - b * Math.floor(a / b);
      return a < 0 ? a + b : a;
    }
  }]);

  return DMath;
}();

var PrayerTimes = /*#__PURE__*/function () {
  function PrayerTimes() {
    var method = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "MWL";

    _classCallCheck(this, PrayerTimes);

    this._method = method;
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
    };
    this.methods = {
      MWL: {
        name: 'Muslim World League',
        params: {
          fajr: 18,
          isha: 17
        }
      },
      ISNA: {
        name: 'Islamic Society of North America (ISNA)',
        params: {
          fajr: 15,
          isha: 15
        }
      },
      MF: {
        name: 'Muslims of France (MF)',
        params: {
          fajr: 12,
          isha: 12
        }
      },
      Egypt: {
        name: 'Egyptian General Authority of Survey',
        params: {
          fajr: 19.5,
          isha: 17.5
        }
      },
      Makkah: {
        name: 'Umm Al-Qura University, Makkah',
        params: {
          fajr: 18.5,
          isha: '90 min'
        }
      },
      // fajr was 19 degrees before 1430 hijri
      Karachi: {
        name: 'University of Islamic Sciences, Karachi',
        params: {
          fajr: 18,
          isha: 18
        }
      },
      Tehran: {
        name: 'Institute of Geophysics, University of Tehran',
        params: {
          fajr: 17.7,
          isha: 14,
          maghrib: 4.5,
          midnight: 'Jafari'
        }
      },
      // isha is not explicitly specified in this method
      Jafari: {
        name: 'Shia Ithna-Ashari, Leva Institute, Qum',
        params: {
          fajr: 16,
          isha: 14,
          maghrib: 4,
          midnight: 'Jafari'
        }
      },
      JAKIM: {
        name: 'Jabatan Kemajuan Islam Malaysia',
        params: {
          fajr: 20,
          isha: 18
        }
      }
    };
    this.defaultParams = {
      maghrib: '0 min',
      midnight: 'Standard'
    };
    this.setting = {
      imsak: '10 min',
      dhuhr: '0 min',
      asr: 'Standard',
      highLats: 'NightMiddle'
    };
    this.timeFormat = '24h';
    this.timeSuffixes = ['am', 'pm'];
    this.invalidTime = '---';
    this.numIterations = 1;
    this.offset = {};
    this.lat;
    this.lng;
    this.elv;
    this.timeZone;
    this.jDate;
    this.defParams = this.defaultParams;

    for (var i in this.methods) {
      this.params = this.methods[i].params;

      for (var j in this.defParams) {
        if (typeof this.params[j] == 'undefined') this.params[j] = this.defParams[j];
      }
    }

    this.calcMethod = this.methods[method] ? method : "MWL";
    this.params = this.methods[this.calcMethod].params;

    for (var id in this.params) {
      this.setting[id] = this.params[id];
    }

    for (var _i in this.timeNames) {
      this.offset[_i] = 0;
    }
  }

  _createClass(PrayerTimes, [{
    key: "adjust",
    value: function adjust(params) {
      for (var id in params) {
        this.setting[id] = this.params[id];
      }
    }
  }, {
    key: "tune",
    value: function tune(timeOffsets) {
      for (var i in this.timeOffsets) {
        this.offset[i] = this.timeOffsets[i];
      }
    }
  }, {
    key: "getSetting",
    value: function getSetting() {
      return this.setting;
    }
  }, {
    key: "getOffsets",
    value: function getOffsets() {
      return this.offset;
    }
  }, {
    key: "getDefaults",
    value: function getDefaults() {
      return this.methods;
    }
  }, {
    key: "getTimes",
    value: function getTimes(date, coords, timezone, dst, format) {
      this.lat = 1 * coords[0];
      this.lng = 1 * coords[1];
      this.elv = coords[2] ? 1 * coords[2] : 0;
      this.timeFormat = format || this.timeFormat;
      if (date.constructor === Date) date = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
      if (typeof timezone == 'undefined' || timezone == 'auto') timezone = this.getTimeZone(date);
      if (typeof dst == 'undefined' || dst == 'auto') dst = this.getDst(date);
      this.timeZone = 1 * timezone + (1 * dst ? 1 : 0);
      this.jDate = this.julian(date[0], date[1], date[2]) - this.lng / (15 * 24);
      return this.computeTimes();
    }
  }, {
    key: "getMonthTimes",
    value: function getMonthTimes(month, year, coords, timezone, dst, format) {
      var lastDay = new Date(year, month + 1, 0).getDate();
      var days = [];

      for (var i = 1; i <= lastDay; i++) {
        var date = new Date(year, month, i);
        var times = this.getTimes(date, coords, timezone, dst, format);
        var rs = {
          times: times,
          date: date.getTime()
        };
        days.push(rs);
      }

      return days;
    }
  }, {
    key: "getYearTimes",
    value: function getYearTimes(year, coords, timezone, dst, format) {
      var months = [];

      for (var i = 0; i <= 11; i++) {
        var rs = this.getMonthTimes(i, year, coords, timezone, dst, format);
        months.push(rs);
      }

      return months;
    }
  }, {
    key: "getFormattedTime",
    value: function getFormattedTime(time, format, suffixes) {
      if (isNaN(time)) return this.invalidTime;
      if (format == 'Float') return time;
      suffixes = suffixes || this.timeSuffixes;
      time = DMath.fixHour(time + 0.5 / 60); // add 0.5 minutes to round

      var hours = Math.floor(time);
      var minutes = Math.floor((time - hours) * 60);
      var suffix = format == '12h' ? suffixes[hours < 12 ? 0 : 1] : '';
      var hour = format == '24h' ? this.twoDigitsFormat(hours) : (hours + 12 - 1) % 12 + 1;
      return hour + ':' + this.twoDigitsFormat(minutes) + (suffix ? ' ' + suffix : '');
    }
  }, {
    key: "midDay",
    value: function midDay(time) {
      var eqt = this.sunPosition(this.jDate + time).equation;
      var noon = DMath.fixHour(12 - eqt);
      return noon;
    }
  }, {
    key: "sunAngleTime",
    value: function sunAngleTime(angle, time, direction) {
      var decl = this.sunPosition(this.jDate + time).declination;
      var noon = this.midDay(time);
      var t = 1 / 15 * DMath.arccos((-DMath.sin(angle) - DMath.sin(decl) * DMath.sin(this.lat)) / (DMath.cos(decl) * DMath.cos(this.lat)));
      return noon + (direction == 'ccw' ? -t : t);
    }
  }, {
    key: "asrTime",
    value: function asrTime(factor, time) {
      var decl = this.sunPosition(this.jDate + time).declination;
      var angle = -DMath.arccot(factor + DMath.tan(Math.abs(this.lat - decl)));
      return this.sunAngleTime(angle, time);
    }
  }, {
    key: "sunPosition",
    value: function sunPosition(jd) {
      var D = jd - 2451545.0;
      var g = DMath.fixAngle(357.529 + 0.98560028 * D);
      var q = DMath.fixAngle(280.459 + 0.98564736 * D);
      var L = DMath.fixAngle(q + 1.915 * DMath.sin(g) + 0.020 * DMath.sin(2 * g));
      var R = 1.00014 - 0.01671 * DMath.cos(g) - 0.00014 * DMath.cos(2 * g);
      var e = 23.439 - 0.00000036 * D;
      var RA = DMath.arctan2(DMath.cos(e) * DMath.sin(L), DMath.cos(L)) / 15;
      var eqt = q / 15 - DMath.fixHour(RA);
      var decl = DMath.arcsin(DMath.sin(e) * DMath.sin(L));
      return {
        declination: decl,
        equation: eqt
      };
    }
  }, {
    key: "julian",
    value: function julian(year, month, day) {
      if (month <= 2) {
        year -= 1;
        month += 12;
      }

      var A = Math.floor(year / 100);
      var B = 2 - A + Math.floor(A / 4);
      var JD = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
      return JD;
    }
  }, {
    key: "computePrayerTimes",
    value: function computePrayerTimes(times) {
      times = this.dayPortion(times);
      var params = this.setting;
      var imsak = this.sunAngleTime(this.eval(params.imsak), times.imsak, 'ccw');
      var fajr = this.sunAngleTime(this.eval(params.fajr), times.fajr, 'ccw');
      var sunrise = this.sunAngleTime(this.riseSetAngle(), times.sunrise, 'ccw');
      var dhuhr = this.midDay(times.dhuhr);
      var asr = this.asrTime(this.asrFactor(params.asr), times.asr);
      var sunset = this.sunAngleTime(this.riseSetAngle(), times.sunset);
      var maghrib = this.sunAngleTime(this.eval(params.maghrib), times.maghrib);
      var isha = this.sunAngleTime(this.eval(params.isha), times.isha);
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
  }, {
    key: "computeTimes",
    value: function computeTimes() {
      // default times
      var times = {
        imsak: 5,
        fajr: 5,
        sunrise: 6,
        dhuhr: 12,
        asr: 13,
        sunset: 18,
        maghrib: 18,
        isha: 18
      };

      for (var i = 1; i <= this.numIterations; i++) {
        times = this.computePrayerTimes(times);
      }

      times = this.adjustTimes(times);
      times.midnight = this.setting.midnight == 'Jafari' ? times.sunset + this.timeDiff(times.sunset, times.fajr) / 2 : times.sunset + this.timeDiff(times.sunset, times.sunrise) / 2;
      times = this.tuneTimes(times);
      return this.modifyFormats(times);
    }
  }, {
    key: "adjustTimes",
    value: function adjustTimes(times) {
      var params = this.setting;

      for (var i in times) {
        times[i] += this.timeZone - this.lng / 15;
      }

      if (params.highLats != 'None') times = this.adjustHighLats(times);
      if (this.isMin(params.imsak)) times.imsak = times.fajr - this.eval(params.imsak) / 60;
      if (this.isMin(params.maghrib)) times.maghrib = times.sunset + this.eval(params.maghrib) / 60;
      if (this.isMin(params.isha)) times.isha = times.maghrib + this.eval(params.isha) / 60;
      times.dhuhr += this.eval(params.dhuhr) / 60;
      return times;
    }
  }, {
    key: "asrFactor",
    value: function asrFactor(asrParam) {
      var factor = {
        Standard: 1,
        Hanafi: 2
      }[asrParam];
      return factor || this.eval(asrParam);
    }
  }, {
    key: "riseSetAngle",
    value: function riseSetAngle() {
      //let earthRad = 6371009; // in meters
      //let angle = DMath.arccos(earthRad/(earthRad+ elv));
      var angle = 0.0347 * Math.sqrt(this.elv); // an approximation

      return 0.833 + angle;
    }
  }, {
    key: "tuneTimes",
    value: function tuneTimes(times) {
      for (var i in times) {
        times[i] += this.offset[i] / 60;
      }

      return times;
    }
  }, {
    key: "modifyFormats",
    value: function modifyFormats(times) {
      for (var i in times) {
        times[i] = this.getFormattedTime(times[i], this.timeFormat);
      }

      return times;
    }
  }, {
    key: "adjustHighLats",
    value: function adjustHighLats(times) {
      var params = this.setting;
      var nightTime = this.timeDiff(times.sunset, times.sunrise);
      times.imsak = this.adjustHLTime(times.imsak, times.sunrise, this.eval(params.imsak), nightTime, 'ccw');
      times.fajr = this.adjustHLTime(times.fajr, times.sunrise, this.eval(params.fajr), nightTime, 'ccw');
      times.isha = this.adjustHLTime(times.isha, times.sunset, this.eval(params.isha), nightTime);
      times.maghrib = this.adjustHLTime(times.maghrib, times.sunset, this.eval(params.maghrib), nightTime);
      return times;
    }
  }, {
    key: "adjustHLTime",
    value: function adjustHLTime(time, base, angle, night, direction) {
      var portion = this.nightPortion(angle, night);
      var timeDiff = direction == 'ccw' ? this.timeDiff(time, base) : this.timeDiff(base, time);
      if (isNaN(time) || timeDiff > portion) time = base + (direction == 'ccw' ? -portion : portion);
      return time;
    }
  }, {
    key: "nightPortion",
    value: function nightPortion(angle, night) {
      var method = this.setting.highLats;
      var portion = 1 / 2; // MidNight

      if (method == 'AngleBased') portion = 1 / 60 * angle;
      if (method == 'OneSeventh') portion = 1 / 7;
      return portion * night;
    }
  }, {
    key: "dayPortion",
    value: function dayPortion(times) {
      for (var i in times) {
        times[i] /= 24;
      }

      return times;
    }
  }, {
    key: "getTimeZone",
    value: function getTimeZone(date) {
      var year = date[0];
      var t1 = this.gmtOffset([year, 0, 1]);
      var t2 = this.gmtOffset([year, 6, 1]);
      return Math.min(t1, t2);
    }
  }, {
    key: "getDst",
    value: function getDst(date) {
      return 1 * (this.gmtOffset(date) != this.getTimeZone(date));
    }
  }, {
    key: "gmtOffset",
    value: function gmtOffset(date) {
      var localDate = new Date(date[0], date[1] - 1, date[2], 12, 0, 0, 0);
      var GMTString = localDate.toGMTString();
      var GMTDate = new Date(GMTString.substring(0, GMTString.lastIndexOf(' ') - 1));
      var hoursDiff = (localDate - GMTDate) / (1000 * 60 * 60);
      return hoursDiff;
    }
  }, {
    key: "eval",
    value: function _eval(str) {
      return 1 * (str + '').split(/[^0-9.+-]/)[0];
    }
  }, {
    key: "isMin",
    value: function isMin(arg) {
      return (arg + '').indexOf('min') != -1;
    }
  }, {
    key: "timeDiff",
    value: function timeDiff(time1, time2) {
      return DMath.fixHour(time2 - time1);
    }
  }, {
    key: "twoDigitsFormat",
    value: function twoDigitsFormat(num) {
      return num < 10 ? '0' + num : num;
    }
  }, {
    key: "method",
    set: function set(method) {
      if (this.methods[method]) {
        this.adjust(this.methods[method].params);
        this.calcMethod = method;
      }
    },
    get: function get() {
      return this.calcMethod;
    }
  }]);

  return PrayerTimes;
}();

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = PrayerTimes;
} else if (typeof define === 'function' && define.amd) {
  define([], function () {
    return PrayerTimes;
  });
} else {
  window.PrayerTimes = PrayerTimes;
}