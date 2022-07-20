export function undefinedFallback(...args) {
  return args.find(arg => (typeof arg !== "undefined"))
}
