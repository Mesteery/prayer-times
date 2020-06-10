const assert = require('assert');
const { PrayerManager, Prayer } = require('../dist/index');

describe('PrayerTimes', () => {
  const prayerManager = new PrayerManager()
  describe('#getYearTimes', () => {
    const prayer = prayerManager.getYearTimes(2020, [0, 0]);
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