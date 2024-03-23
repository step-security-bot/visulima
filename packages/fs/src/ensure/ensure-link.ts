import { link, lstat } from "node:fs/promises";

import { dirname } from "pathe";

import assertValidFileOrDirectoryPath from "../utils/assert-valid-file-or-directory-path";
import isStatsIdentical from "../utils/is-stats-identical";
import toPath from "../utils/to-path";
// eslint-disable-next-line unicorn/prevent-abbreviations
import ensureDir from "./ensure-dir";

/**
 * Ensures that the hard link exists.
 * If the directory structure does not exist, it is created.
 */
const ensureLink = async (source: URL | string, destination: URL | string): Promise<void> => {
    assertValidFileOrDirectoryPath(source);
    assertValidFileOrDirectoryPath(destination);

    let destinationStat;

    try {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        destinationStat = await lstat(destination);
    } catch {
        // ignore error
    }

    let sourceStat;

    try {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        sourceStat = await lstat(source);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.message = error.message.replace("lstat", "ensureLink");

        throw error;
    }

    if (destinationStat && isStatsIdentical(sourceStat, destinationStat)) {
        return;
    }

    await ensureDir(dirname(toPath(destination)));

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    await link(source, destination);
};

export default ensureLink;
