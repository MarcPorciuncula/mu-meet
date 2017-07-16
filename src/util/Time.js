
export default class Time {
  constructor(value, unit = 'm') {
    if (unit === 'h') {
      value = value * 60;
    }
    if (unit === 's') {
      value = value / 60
    }
    this.value = value; /* minutes since 12am */
  }
  getHour() { /* from 1 to 12 */
    let hour = Math.floor(this.value / 60 % 12);
    // Zero hours is 12 o clock
    return hour !== 0 ? hour : 12;
  }
  getMinute() {
    return this.value % 60;
  }
  getHalf() {
    return this.value < 60 * 12 ? 'am' : 'pm';
  }
  setHour(hour) {
    // 12 o clock is 0 hours
    const hours = hour !== 12 ? hour : 0;
    const minutes = this.getMinute();
    const half = this.getHalf();
    this.value = (half === 'am' ? 0 : 12 * 60) + hours * 60 + minutes;
  }
  setMinute(minutes) {
    const hours = this.getHour() !== 12 ? this.getHour() : 0;
    const half = this.getHalf();
    this.value = (half === 'am' ? 0 : 12 * 60) + hours * 60 + minutes;
  }
  setHalf(half) {
    const hours = this.getHour() !== 12 ? this.getHour() : 0;
    const minutes = this.getMinute();
    this.value = (half === 'am' ? 0 : 12 * 60) + hours * 60 + minutes;
  }
}
