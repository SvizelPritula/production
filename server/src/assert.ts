export function isObject(value: any) {
  return typeof value === "object" && value != null;
}

export function isInt(value: any) {
  return (
    typeof value === "number" &&
    isFinite(value) &&
    Math.round(value) === value &&
    value <= Number.MAX_SAFE_INTEGER &&
    value >= Number.MIN_SAFE_INTEGER
  );
}

export function isReal(value: any) {
  return typeof value === "number" && isFinite(value);
}
