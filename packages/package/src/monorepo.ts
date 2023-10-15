import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

import type { Options } from "find-up";
import { findUp } from "find-up";
import stripJsonComments from "strip-json-comments";

import { findPackageManager } from "./package-manager";

export type Strategy = "lerna" | "npm" | "pnpm" | "turbo" | "yarn";

export interface RootMonorepo<T extends Strategy = Strategy> {
    path: string;
    strategy: T;
}

/**
 * An asynchronous function to find the root directory path and strategy for a monorepo based on
 * the given current working directory (cwd).
 *
 * @param cwd - The current working directory. The type of `cwd` is part of an `Options` type, specifically `Options["cwd"]`.
 *              Default is undefined.
 * @returns A `Promise` that resolves to the root directory path and strategy for the monorepo.
 *          The type of the returned promise is `Promise<RootMonorepo>`.
 * @throws An `Error` if no monorepo root can be found using lerna, yarn, pnpm, or npm as indicators.
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
export const findMonorepoRoot = async (cwd?: Options["cwd"]): Promise<RootMonorepo> => {
    const workspaceFilePath = await findUp(["lerna.json", "turbo.json"], {
        allowSymlinks: false,
        type: "file",
        ...(cwd && { cwd }),
    });

    if (workspaceFilePath && workspaceFilePath.endsWith("lerna.json")) {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        const lerna = JSON.parse(stripJsonComments(readFileSync(workspaceFilePath, "utf8"))) as { packages?: string[]; useWorkspaces?: boolean };

        if (lerna.useWorkspaces || lerna.packages) {
            return {
                path: dirname(workspaceFilePath),
                strategy: "lerna",
            };
        }
    }

    const isTurbo = workspaceFilePath && workspaceFilePath.endsWith("turbo.json");

    try {
        const { packageManager, path } = await findPackageManager(cwd);

        if (["npm", "yarn"].includes(packageManager)) {
            const packageJsonFilePath = join(path, "package.json");

            // eslint-disable-next-line security/detect-non-literal-fs-filename
            if (existsSync(packageJsonFilePath)) {
                // eslint-disable-next-line security/detect-non-literal-fs-filename
                const packageJson = readFileSync(join(path, "package.json"), "utf8");

                if (packageJson.includes("workspaces")) {
                    return {
                        path,
                        strategy: isTurbo ? "turbo" : (packageManager as "npm" | "yarn"),
                    };
                }
            }
        } else if (packageManager === "pnpm") {
            const pnpmWorkspacesFilePath = join(path, "pnpm-workspace.yaml");

            // eslint-disable-next-line security/detect-non-literal-fs-filename
            if (existsSync(pnpmWorkspacesFilePath)) {
                return {
                    path,
                    strategy: isTurbo ? "turbo" : "pnpm",
                };
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        // Skip this error to show the error message from the next block
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        if (!error.message.includes("Could not find lock file")) {
            throw error;
        }
    }

    throw new Error(`No monorepo root could be found upwards from the directory ${cwd as string} using lerna, yarn, pnpm, or npm as indicators.`);
};
