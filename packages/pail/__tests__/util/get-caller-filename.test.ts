import { describe, expect, it } from "vitest";

import { getCallerFilename } from "../../src/util/get-caller-filename";

describe("getCallerFilename", () => {
    it("should return the filename, line number, and column number when called from a function in a file", () => {
        const result = getCallerFilename();

        expect(result.fileName).toBeDefined();
        expect(result.lineNumber).toBeDefined();
        expect(result.columnNumber).toBeDefined();
    });
});
