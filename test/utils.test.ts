import { undefinedFallback } from "../src/utils"

describe("undefinedFallback", () => {
  it("returns first undefined value", () => {
    expect(undefinedFallback(undefined, "", 2)).toBe("")
    expect(undefinedFallback(undefined, undefined, 2)).toBe(2)
    expect(undefinedFallback(undefined, undefined, undefined)).toBe(undefined)
  })
})
