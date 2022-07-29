export function undefinedFallback(...args: any[]): any {
  return args.find(arg => (typeof arg !== "undefined"))
}
