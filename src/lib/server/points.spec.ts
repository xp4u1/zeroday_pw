import { describe, it, expect } from "vitest";
import { calculatePoints } from "./points";

describe("calculatePoints", () => {
  it("should return correct points when some participants pass", () => {
    const usersCount = 100;
    const solvesCount = 50;

    const result = calculatePoints(usersCount, solvesCount);

    expect(result).toBeTypeOf("number");
    expect(result).toBeGreaterThanOrEqual(100);
    expect(result).toBeLessThanOrEqual(500);
  });

  it("should return the minimum points when all participants pass", () => {
    expect(calculatePoints(3, 3)).toBe(100);
    expect(calculatePoints(42, 42)).toBe(100);
  });

  it("should return 500 points when no participants pass", () => {
    expect(calculatePoints(0, 0)).toBe(500);
    expect(calculatePoints(1, 0)).toBe(500);
    expect(calculatePoints(42, 0)).toBe(500);
  });

  it("should return 500 if there is 1 user and 1 solve", () => {
    expect(calculatePoints(1, 1)).toBe(500);
  });

  it("should handle very large numbers of participants", () => {
    const usersCount = 1000000;
    const solvesCount = 500000;

    const result = calculatePoints(usersCount, solvesCount);

    expect(result).toBeTypeOf("number");
    expect(result).toBeGreaterThanOrEqual(100);
    expect(result).toBeLessThanOrEqual(500);
  });

  it("should fail if solvesCount > usersCount", () => {
    expect(() => calculatePoints(50, 100)).toThrow(
      "solvesCount cannot be greater than usersCount",
    );
  });
});
