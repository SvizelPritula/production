function getAverage(array: number[]) {
  return array.reduce((a, b) => a + b) / array.length;
}

function getInterquartileMean(array: number[]) {
  var removedTotal = Math.floor(array.length / 2);
  var removedTop = Math.floor(removedTotal / 2);
  var removedBottom = removedTotal - removedTop;

  array = array.slice();
  array.sort((a, b) => a - b);

  array = array.slice(removedBottom, removedTop > 0 ? -removedTop : undefined);
  return getAverage(array);
}

export class ClockAdjuster {
  private history: number[] = [];

  getTime() {
    return Date.now() + this.getSkew();
  }

  getSkew() {
    if (this.history.length === 0) return 0;

    return getInterquartileMean(this.history);
  }

  recordSkew(skew: number) {
    this.history.push(skew);

    if (this.history.length >= 8) {
      this.history.shift();
    }
  }

  hasSkewData(): boolean {
    return this.history.length > 0;
  }
}
