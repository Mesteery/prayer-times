const assert = require('assert');
const { PrayerManager, Prayer } = require('../src/index');

describe('PrayerTimes', () => {
  const prayerManager = new PrayerManager()
  describe('#getTimes', () => {
    let prayer = prayerManager.getTimes([2020, 6, 1], [0, 0], 1)
    it('should return the good time', () => {
      assert.strictEqual(prayer.find(p => p.name === "fajr").formatted, "06:40")
    })
  })
  describe('#getYearTimes', () => {
    let prayer = prayerManager.getYearTimes(2020, [0, 0]);
    it('should return a array of 12 items', () => {
      assert.strictEqual(prayer.length, 12);
    });
    it('should return a array of array of array of Prayer', () => {
      assert(prayer[0][0][0] instanceof Prayer)
    })
    it ('should return a array of array of array of Prayer that should return a valid date', () => {
      assert(prayer[0][0][0].date instanceof Date)
    })
  });
  describe('#method', () => {
    it('should return ISNA', () => {
      prayerManager.method = "ISNA";
      assert.strictEqual(prayerManager.method, "ISNA");
    })
  });
});