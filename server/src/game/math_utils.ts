export function product(...values: number[]): number {
    return values.reduce((a, b) => a * b);
}

export function linear_interpolation(points: [x: number, y: number][]): (x: number) => number {
    if (points.length <= 1) throw new Error("Linear interpolation must have at least one point");

    points = points.slice().sort((a, b) => a[0] - b[0]);

    return x => {
        for (var segment = 0; segment <= points.length; segment++) {
            var left = points[segment - 1] ?? null;
            var right = points[segment] ?? null;

            if (left != null && x < left[0]) continue;
            if (right != null && x > right[0]) continue;

            if (left == null)
                return right[1];
            if (right == null)
                return left[1];

            var position = x - left[0];

            var dx = right[0] - left[0];
            var dy = right[1] - left[1];

            return right[1] + Math.round((dy * position) / dx);
        }

        return 0;
    };
}
