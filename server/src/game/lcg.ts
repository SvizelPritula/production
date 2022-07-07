export class LCG {
    seed: number;

    static readonly multiplier: number = 69069;
    static readonly increment: number = 1;
    static readonly modulus: number = 0x100000000;
    static readonly maximum: number = 0x1000000;

    constructor(seed: number) {
        this.seed = (seed ^ LCG.multiplier) % LCG.modulus;

        for (var i = 0; i < 4; i++) {
            this.next();
        }
    }

    next() {
        this.seed = (Math.imul(this.seed, LCG.multiplier) + LCG.increment) % LCG.modulus;
    }

    private nextRaw(): number {
        this.next();
        return this.seed >>> 8;
    }

    nextInt(): number;
    nextInt(end: number): number;
    nextInt(start?: number, end?: number): number {
        if (start == undefined && end == undefined) {
            end = LCG.maximum;
            start = 0;
        } else if (end == undefined) {
            end = start;
            start = 0;
        }

        var max = end! - start!;

        if (max > LCG.maximum) throw new Error(`Range cannot be larger than ${LCG.maximum}`)

        do {
            var result = this.nextRaw();
        } while (this.seed >= LCG.maximum - LCG.maximum % max)

        return start! + result % max;
    }

    nextChoice<T>(array: T[]): T {
        return array[this.nextInt(array.length)];
    }

    nextWeightedChoice<T>(array: [T, number][]): T {
        var sum = array.map(p => p[1]).reduce((a, b) => a + b);
        var target = this.nextInt(sum);

        var runningSum = 0;

        for (var [element, weight] of array) {
            runningSum += weight;

            if (runningSum > target) {
                return element;
            }
        }

        throw new Error("Random index out of range");
    }
}
