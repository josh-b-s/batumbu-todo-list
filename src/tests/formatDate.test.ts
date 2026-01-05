import {describe, expect, it} from "vitest";
import {formatDate} from "../helpers/formatDate";

describe("formatDate", () => {
    it("formats a Date object correctly", () => {
        const date = new Date("2025-12-24T10:54:00");
        const result = formatDate(date);

        expect(result).toBe("24 Des 2025, 10:54");
    });

    it("formats a date string correctly", () => {
        const result = formatDate("2025-12-24T10:54:00");

        expect(result).toBe("24 Des 2025, 10:54");
    });

    it("returns '-' for invalid Date object", () => {
        const invalidDate = new Date("invalid-date");

        expect(formatDate(invalidDate)).toBe("-");
    });

    it("returns '-' for invalid date string", () => {
        expect(formatDate("not-a-date")).toBe("-");
    });

    it("uses 24-hour format (no AM/PM)", () => {
        const date = new Date("2025-12-24T22:05:00");
        const result = formatDate(date);

        expect(result).toContain("22:05");
        expect(result).not.toMatch(/AM|PM/i);
    });
});
