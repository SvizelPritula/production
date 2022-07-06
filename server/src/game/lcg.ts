export class LCG {
    seed: number;

    static readonly multiplier: number = 69069;
    static readonly increment: number = 1;
    static readonly modulus: number = 1 << 32;

    constructor(seed: number) {
        this.seed = (seed ^ LCG.multiplier) % LCG.modulus;

        for (var i = 0; i < 4; i++) {
            this.next();
        }
    }

    next() {
        this.seed = (Math.imul(this.seed, LCG.multiplier) + LCG.increment) % LCG.modulus;
    }

    nextInt(): number;
    nextInt(end: number): number;
    nextInt(start?: number, end?: number): number {
        if (start == undefined && end == undefined) {
            end = LCG.modulus;
            start = 0;
        } else if (end == undefined) {
            end = start;
            start = 0;
        }

        var max = end! - start!;

        do {
            this.next();
        } while (this.seed >= LCG.multiplier - LCG.multiplier % max)

        return start! + this.seed % max;
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
