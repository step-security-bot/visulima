import type { Options as RfsOptions } from "rotating-file-stream";

import type { Meta, Reporter } from "../../types";
import { RotatingFileStream } from "../../util/rotating-file-stream";

export type Options = RfsOptions & {
    filePath: string;
    writeImmediately?: boolean;
};

export abstract class AbstractFileReporter<L extends string = never> implements Reporter<L> {
    protected _stream: RotatingFileStream;

    protected constructor(options: Options) {
        const { filePath, writeImmediately = false, ...rfsOptions } = options;

        this._stream = new RotatingFileStream(filePath, writeImmediately, rfsOptions);
    }

    public log(meta: Meta<L>): void {
        this._stream.write(`${this._formatMessage(meta as Meta<L>)}\n`);
    }

    protected abstract _formatMessage(data: Meta<L>): string;
}
