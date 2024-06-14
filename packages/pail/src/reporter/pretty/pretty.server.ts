import { stderr, stdout } from "node:process";

import colorize, { bgGrey, grey, underline, white } from "@visulima/colorize";
import type { stringify } from "safe-stable-stringify";
// eslint-disable-next-line import/no-extraneous-dependencies
import stringLength from "string-length";
// eslint-disable-next-line import/no-extraneous-dependencies
import terminalSize from "terminal-size";
import type { LiteralUnion } from "type-fest";
// eslint-disable-next-line import/no-extraneous-dependencies
import wrapAnsi from "wrap-ansi";

import { EMPTY_SYMBOL } from "../../constants";
import type InteractiveManager from "../../interactive/interactive-manager";
import type { ExtendedRfc5424LogLevels, InteractiveStreamReporter, ReadonlyMeta } from "../../types";
import getLongestBadge from "../../utils/get-longest-badge";
import getLongestLabel from "../../utils/get-longest-label";
import writeStream from "../../utils/write-stream";
import formatError from "../utils/format-error";
import formatLabel from "../utils/format-label";
import type { PrettyStyleOptions } from "./abstract-pretty-reporter";
import { AbstractPrettyReporter } from "./abstract-pretty-reporter";

class PrettyReporter<T extends string = string, L extends string = string> extends AbstractPrettyReporter<T, L> implements InteractiveStreamReporter<L> {
    #stdout: NodeJS.WriteStream;

    #stderr: NodeJS.WriteStream;

    #interactiveManager: InteractiveManager | undefined;

    #interactive = false;

    public constructor(options: Partial<PrettyStyleOptions> = {}) {
        super({
            uppercase: {
                label: true,
                ...options.uppercase,
            },
            ...options,
        });

        this.#stdout = stdout;
        this.#stderr = stderr;
    }

    public setStdout(stdout_: NodeJS.WriteStream): void {
        this.#stdout = stdout_;
    }

    public setStderr(stderr_: NodeJS.WriteStream): void {
        this.#stderr = stderr_;
    }

    public setInteractiveManager(manager?: InteractiveManager): void {
        this.#interactiveManager = manager;
    }

    public setIsInteractive(interactive: boolean): void {
        this.#interactive = interactive;
    }

    public log(meta: ReadonlyMeta<L>): void {
        this._log(this._formatMessage(meta as ReadonlyMeta<L>), meta.type.level);
    }

    // eslint-disable-next-line sonarjs/cognitive-complexity
    protected _formatMessage(data: ReadonlyMeta<L>): string {
        const { columns } = terminalSize();

        let size = columns;

        if (typeof this._styles.messageLength === "number") {
            size = this._styles.messageLength;
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment,@typescript-eslint/prefer-ts-expect-error
        // @ts-ignore - @TODO: check rollup-plugin-dts
        const { badge, context, date, error, file, groups, label, message, prefix, repeated, scope, suffix, traceError, type } = data;

        const { color } = this._loggerTypes[type.name as keyof typeof this._loggerTypes];
        // eslint-disable-next-line security/detect-object-injection
        const colorized = color ? colorize[color] : white;

        const groupSpaces: string = groups.map(() => "    ").join("");
        const items: string[] = [];

        if (groups.length > 0) {
            items.push(groupSpaces + grey("[" + groups.at(-1) + "]") + " ");
        }

        if (date) {
            items.push(grey(this._styles.dateFormatter(typeof date === "string" ? new Date(date) : date)) + " ");
        }

        if (badge) {
            items.push(colorized(badge) as string);
        } else {
            const longestBadge: string = getLongestBadge<L, T>(this._loggerTypes);

            if (longestBadge.length > 0) {
                items.push(grey(".".repeat(longestBadge.length)) + " ");
            }
        }

        const longestLabel: string = getLongestLabel<L, T>(this._loggerTypes);

        if (label) {
            items.push(colorized(formatLabel(label as string, this._styles)) + " ", grey(".".repeat(longestLabel.length - stringLength(label as string))));
        } else {
            // plus 2 for the space and the dot
            items.push(grey(".".repeat(longestLabel.length + 2)));
        }

        if (repeated) {
            items.push(bgGrey.white("[" + repeated + "x]") + " ");
        }

        if (Array.isArray(scope) && scope.length > 0) {
            items.push(" " + grey("[" + scope.join(" > ") + "]") + " ");
        }

        if (prefix) {
            items.push(
                grey(
                    (Array.isArray(scope) && scope.length > 0 ? ". " : " ") +
                        "[" +
                        (this._styles.underline.prefix ? underline(prefix as string) : prefix) +
                        "]",
                ) + " ",
            );
        }

        const titleSize = stringLength(items.join(" "));

        if (file) {
            const fileMessage = file.name + (file.line ? ":" + file.line : "");
            const fileMessageSize = stringLength(fileMessage);

            if (fileMessageSize + titleSize + 2 > size) {
                items.push(grey(" " + fileMessage));
            } else {
                items.push(grey(".".repeat(size - titleSize - fileMessageSize - 2) + " " + fileMessage));
            }
        } else {
            items.push(grey(".".repeat(size - titleSize - 1)));
        }

        if (items.length > 0) {
            items.push("\n\n");
        }

        if (message !== EMPTY_SYMBOL) {
            const formattedMessage: string | undefined = typeof message === "string" ? message : (this._stringify as typeof stringify)(message);

            items.push(
                groupSpaces +
                    wrapAnsi(formattedMessage ?? "undefined", size - 3, {
                        hard: true,
                        trim: true,
                        wordWrap: true,
                    }),
            );
        }

        if (context) {
            let hasError = false;

            items.push(
                ...context.map((value) => {
                    if (value instanceof Error) {
                        hasError = true;
                        return "\n\n" + formatError(value, size, groupSpaces);
                    }

                    if (typeof value === "object") {
                        return " " + (this._stringify as typeof stringify)(value);
                    }

                    const newValue = (hasError ? "\n\n" : " ") + value;

                    hasError = false;

                    return newValue;
                }),
            );
        }

        if (error) {
            items.push(formatError(error as Error, size, groupSpaces));
        }

        if (traceError) {
            items.push(formatError(traceError as Error, size, groupSpaces, true));
        }

        if (suffix) {
            items.push("\n", groupSpaces + grey(this._styles.underline.suffix ? underline(suffix as string) : suffix));
        }

        return items.join("") + "\n";
    }

    protected _log(message: string, logLevel: LiteralUnion<ExtendedRfc5424LogLevels, L>): void {
        const streamType = ["error", "trace", "warn"].includes(logLevel as string) ? "stderr" : "stdout";
        const stream = streamType === "stderr" ? this.#stderr : this.#stdout;

        if (this.#interactive && this.#interactiveManager !== undefined && stream.isTTY) {
            this.#interactiveManager.update(streamType, message.split("\n"), 0);
        } else {
            writeStream(message + "\n", stream);
        }
    }
}

export default PrettyReporter;
