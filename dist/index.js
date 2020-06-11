"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DMath = {
  dtr: function dtr(d) {
    return d * Math.PI / 180.0;
  },
  rtd: function rtd(r) {
    return r * 180.0 / Math.PI;
  },
  sin: function sin(d) {
    return Math.sin(this.dtr(d));
  },
  cos: function cos(d) {
    return Math.cos(this.dtr(d));
  },
  tan: function tan(d) {
    return Math.tan(this.dtr(d));
  },
  arcsin: function arcsin(d) {
    return this.rtd(Math.asin(d));
  },
  arccos: function arccos(d) {
    return this.rtd(Math.acos(d));
  },
  arctan: function arctan(d) {
    return this.rtd(Math.atan(d));
  },
  arccot: function arccot(x) {
    return this.rtd(Math.atan(1 / x));
  },
  arctan2: function arctan2(y, x) {
    return this.rtd(Math.atan2(y, x));
  },
  fixAngle: function fixAngle(a) {
    return this.fix(a, 360);
  },
  fixHour: function fixHour(a) {
    return this.fix(a, 24);
  },
  fix: function fix(a, b) {
    a = a - b * Math.floor(a / b);
    return a < 0 ? a + b : a;
  }
};

var Prayer = function Prayer(name, date, formatted) {
  _classCallCheck(this, Prayer);

  this.name = name;
  this.date = date;
  this.formatted = formatted;
};

_defineProperty(Prayer, "TimeNames", {
  imsak: 'Imsak',
  fajr: 'Fajr',
  sunrise: 'Sunrise',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  sunset: 'Sunset',
  maghrib: 'Maghrib',
  isha: 'Isha',
  midnight: 'Midnight'
});

var PrayerManager = /*#__PURE__*/function () {
  /**
   * Create a PrayerManager
   * @param {string} [method=MWL] The calculation method to calculate prayer times
   */
  function PrayerManager() {
    var method = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "MWL";

    _classCallCheck(this, PrayerManager);

    this._method = method;
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
    this.adjust(this.params);

    for (var _i in Prayer.TimeNames) {
      this.offset[_i] = 0;
    }
  }

  _createClass(PrayerManager, [{
    key: "adjust",
    value: function adjust(params) {
      for (var id in params) {
        this.setting[id] = params[id];
      }
    }
  }, {
    key: "tune",
    value: function tune(timeOffsets) {
      for (var i in timeOffsets) {
        this.offset[i] = timeOffsets[i];
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
    /**
     * Get the prayer times for a specific date
     * @param {([number, number, number]|Date|number)} [date=new Date()] The date you want prayer times ([year, month, day] or Date or timestamp)
     * @param {[number, number, number]} coords The coordinates at which you want the prayer times (elevation is optionnal)
     * @param {number|"auto"} [timezone=auto] The timezone
     * @param {(1|0|"auto")} [dst=auto"] The Daylight Saving Times
     * @param {("24h"|"12h"|"12hNS"|"Float")} [format=24h] The ouput format of prayer times
     * @returns {Prayer[]} A array of prayer times
     */

  }, {
    key: "getTimes",
    value: function getTimes() {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
      var coords = arguments.length > 1 ? arguments[1] : undefined;
      var timezone = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'auto';
      var dst = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'auto';
      var format = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '24h';
      this.lat = Number(coords[0]);
      this.lng = Number(coords[1]);
      this.elv = coords[2] ? Number(coords[2]) : 0;
      this.timeFormat = format || this.timeFormat;
      if (typeof date === "number") date = new Date(date);
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

  }, {
    key: "getMonthTimes",
    value: function getMonthTimes(_ref, coords, timezone, dst, format) {
      var _this = this;

      var _ref2 = _slicedToArray(_ref, 2),
          year = _ref2[0],
          month = _ref2[1];

      year = Number(year);
      month = Number(month);
      return _toConsumableArray(Array(new Date(year, month, 0).getDate())).map(function (_, d) {
        return _this.getTimes(new Date(year, month, d + 1), coords, timezone, dst, format);
      });
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

  }, {
    key: "getYearTimes",
    value: function getYearTimes(year, coords, timezone, dst, format) {
      var _this2 = this;

      if (typeof year !== "number") throw new Error("The year argument must be a number");
      return _toConsumableArray(Array(12)).map(function (_, m) {
        return _this2.getMonthTimes([year, m + 1], coords, timezone, dst, format);
      });
    }
  }, {
    key: "getFormattedTime",
    value: function getFormattedTime(time, format, suffixes) {
      if (isNaN(time)) return this.invalidTime;
      if (format === 'Float') return time;
      suffixes = suffixes || this.timeSuffixes;
      time = DMath.fixHour(time + 0.5 / 60); // add 0.5 minutes to round

      var hours = Math.floor(time);
      var minutes = Math.floor((time - hours) * 60);
      var suffix = format === '12h' ? suffixes[hours < 12 ? 0 : 1] : '';
      var hour = format === '24h' ? this.twoDigitsFormat(hours) : (hours + 12 - 1) % 12 + 1;
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
      return noon + (direction === 'ccw' ? -t : t);
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
      var equation = q / 15 - DMath.fixHour(RA);
      var declination = DMath.arcsin(DMath.sin(e) * DMath.sin(L));
      return {
        declination: declination,
        equation: equation
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
    value: function computeTimes(date) {
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
      times.midnight = this.setting.midnight === 'Jafari' ? times.sunset + this.timeDiff(times.sunset, times.fajr) / 2 : times.sunset + this.timeDiff(times.sunset, times.sunrise) / 2;
      times = this.tuneTimes(times);
      return this.modifyFormats(times, date);
    }
  }, {
    key: "adjustTimes",
    value: function adjustTimes(times) {
      var params = this.setting;

      for (var i in times) {
        times[i] += this.timeZone - this.lng / 15;
      }

      if (params.highLats !== 'None') times = this.adjustHighLats(times);
      if (this.isMin(params.imsak)) times.imsak = times.fajr - this.eval(params.imsak) / 60;
      if (this.isMin(params.maghrib)) times.maghrib = times.sunset + this.eval(params.maghrib) / 60;
      if (this.isMin(params.isha)) times.isha = times.maghrib + this.eval(params.isha) / 60;
      times.dhuhr += this.eval(params.dhuhr) / 60;
      return times;
    }
  }, {
    key: "asrFactor",
    value: function asrFactor(asrParam) {
      return {
        Standard: 1,
        Hanafi: 2
      }[asrParam] || this.eval(asrParam);
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
    value: function modifyFormats(times, _ref3) {
      var _ref4 = _slicedToArray(_ref3, 3),
          year = _ref4[0],
          month = _ref4[1],
          day = _ref4[2];

      var prayers = [];

      for (var i in times) {
        var formatted = this.getFormattedTime(times[i], this.timeFormat);
        if (formatted === this.invalidTime) prayers.push(new Prayer(i, null, formatted));else {
          var time = DMath.fixHour(times[i] + 0.5 / 60);
          var hours = Math.floor(time);
          prayers.push(new Prayer(i, new Date(Date.UTC(year, month - 1, day, hours, Math.floor((time - hours) * 60), 0, 0)), formatted));
        }
      }

      return prayers;
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
      return Number(this.gmtOffset(date) != this.getTimeZone(date));
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
      return Number(String(str).split(/[^0-9.+-]/)[0]);
    }
  }, {
    key: "isMin",
    value: function isMin(arg) {
      return String(arg).indexOf('min') !== -1;
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
      if (this.methods[String(method)]) {
        this.adjust(this.methods[method].params);
        this.calcMethod = method;
      } else throw new Error("The method " + method + " doesn't exists");
    },
    get: function get() {
      return this.calcMethod;
    }
  }]);

  return PrayerManager;
}();

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = {
    PrayerManager: PrayerManager,
    Prayer: Prayer
  };
} else if (typeof define === 'function' && define.amd) {
  define([], function () {
    return {
      PrayerManager: PrayerManager,
      Prayer: Prayer
    };
  });
} else {
  window.PrayerTimes = {
    PrayerManager: PrayerManager,
    Prayer: Prayer
  };
}