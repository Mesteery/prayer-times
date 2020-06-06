const assert = require('assert');
const PrayerTimes = require('../dist/index');

describe('PrayerTimes', () => {
  const prayerManager = new PrayerTimes()
  describe('#getYearTimes', () => {
    it('should return a array of 12 items', () => {
      let prayer = prayerManager.getYearTimes(2020, [0, 0], 'auto', 'auto', '24h');
      assert.strictEqual(prayer.length, 12);
    });
  });
  describe('#method', () => {
    it('should return ISNA', () => {
      prayerManager.method = "ISNA";
      assert.strictEqual(prayerManager.method, "ISNA");
    })
  });
});