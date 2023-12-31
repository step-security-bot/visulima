import { join } from "path";
import Stream from "node:stream";
import { Buffer } from "node:buffer";

import { pail, createPail } from "@visulima/pail";
import { CallerProcessor } from "@visulima/pail/processor";
import { JsonReporter } from "@visulima/pail/reporter/json";
import { JsonFileReporter } from "@visulima/pail/reporter/json-file";

const __dirname = new URL(".", import.meta.url).pathname;

console.log("------------------ DEFAULT ------------------");

pail.complete("Hello World!");

console.log("------------------ SCOPE NEW CUSTOM ------------------");

const newLogger = pail.scope("new custom");

newLogger.complete("Hello World!");

console.log("------------------ SCOPE CLIENT|SERVER ------------------");

const newLogger2 = newLogger.scope("client", "server");

newLogger2.complete("Logger 2 - Hello World! ".repeat(50));
newLogger2.error({
    message: "Logger 2 - Hello World! ".repeat(50),
    suffix: "test",
});

const newError = new Error("New Error");

newLogger2.error(
    new Error("Hello World!", {
        cause: newError,
    }),
);
newLogger2.warn(new TypeError("Hello World! ".repeat(50)));

newLogger2.notice({
    message: "Hello World!",
    suffix: "suffix",
    prefix: "prefix",
});

console.log("------------------ REPEATER ------------------");

function wait(delay) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}

const repeaterLogger = createPail({
    throttle: 100,
});

for (let i = 0; i < 10; i++) {
    repeaterLogger.info("repeated message");
}

await wait(300);

console.log("------------------ JSON ------------------");

const jsonLogger = createPail({
    processors: [new CallerProcessor()],
    reporters: [
        new JsonReporter(),
        new JsonFileReporter({
            filePath: join(__dirname, "test.log"),
        }),
    ],
});

jsonLogger.info("Hello Json!");

jsonLogger.info({
    message: "Hello Json!",
    suffix: "suffix",
    prefix: "prefix",
    context: {
        test: new ArrayBuffer(1),
        stream: new Stream.Stream(),
        buffer: Buffer.alloc(1),
    },
});

jsonLogger.error(
    new Error("Hello Json!", {
        cause: newError,
    }),
);
jsonLogger.warn(new TypeError("Hello Json!"));

class TestFunctionCall {
    getParams() {
        return Array.from(arguments);
    }
    count(arg1, arg2) {
        let methodName = "count";
        return { method: methodName, args: this.getParams.apply(this, arguments) };
    }
}
let test = new TestFunctionCall();

pail.info(test.count("a", "b"));

console.log("------------------ INTERACTIVE ------------------");

const interactive = createPail({ interactive: true, scope: "interactive" });

const TICKS = 60;
const TIMEOUT = 80;
const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
const messages = ['Swapping time and space...', 'Have a good day.', "Don't panic...", 'Updating Updater...', '42'];
let ticks = TICKS;
let i = 0;

const interactiveManager = interactive.getInteractiveManager();

interactiveManager.hook();

// eslint-disable-next-line no-console
console.log(' - log message');
// eslint-disable-next-line no-console
console.error(' - error message');
// eslint-disable-next-line no-console
console.warn(' - warn message');

const id = setInterval(() => {
  if (--ticks < 0) {
    clearInterval(id);

    interactiveManager.update(['✔ Success', '', 'Messages:', 'this line is be deleted!!!']);
    interactiveManager.erase(1);
    interactiveManager.unhook(false);
  } else {
    const frame = frames[(i = ++i % frames.length)];
    const index = Math.round(ticks / 10) % messages.length;
    const message = messages[index];

    if (message) {
        interactiveManager.update([`${frame} Some process...`, message]);
    }
  }
}, TIMEOUT);
