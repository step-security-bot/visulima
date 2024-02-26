//
// ATTENTION !!! ACHTUNG !!! MEGA ULTRA IMPORTANT !!! WICHTIG !!!
//
// For the correct measures, DO NOT use the same function instance inside the added benchmark:
// bench('Benchmark')
//   .add('bench1', () => anyFixture(arg1)) // <== only first measure of `anyFixture()` will be correct
//   .add('bench2', () => anyFixture(arg2)) // <== second and next measures of same function will be WRONG!
//
// Solution.
// Create the fixture as pure function and clone it for each added benchmark:
//
// const uniqFixture = [
//   clonePureFunction(anyFixture),
//   clonePureFunction(anyFixture),
//   ...
// ]
//
// or use:
// const uniqFixture = createFixture(arrayOfLibraries, anyFixture);
//
// bench('Benchmark')
//   .add('bench1', () => uniqFixture[0](arg1)) // <== the cloned function will be correct measured
//   .add('bench2', () => uniqFixture[1](arg2)) // <== the cloned function will be correct measured
//

"use strict";

import Bench from "./lib/bench.js";
import { createFixture } from "./lib/utils.js";

// vendor libraries for benchmark
import chalk from "chalk";
import colorsJs from "colors";
import * as colorette from "colorette";
import ansiColors from "ansi-colors";
import cliColor from "cli-color";
// import colorCli from 'colors-cli/lib/color-safe.js';
import kleur from "kleur";
import * as kleurColors from "kleur/colors";
import picocolors from "picocolors";
import { Ansis, green, red, yellow, hex } from "ansis";
import { Colorize } from "@visulima/colorize";

const log = console.log;

// create a new instance of Ansis for correct measure in benchmark
const ansis = new Ansis();

// create a new instance of Colorize for correct measure in benchmark
const colorize = new Colorize();

// All vendor libraries to be tested
const vendors = [
    { name: "ansi-colors", lib: ansiColors },
    { name: "ansis", lib: ansis },
    { name: "cli-color", lib: cliColor },
    // { name: 'color-cli', lib: colorCli },
    { name: "colors-js", lib: colorsJs },
    { name: "colorette", lib: colorette },
    { name: "chalk", lib: chalk },
    { name: "kleur/colors", lib: kleurColors },
    { name: "kleur", lib: kleur },
    { name: "picocolors", lib: picocolors },
    { name: "visulima/colorize", lib: colorize },
];

const benchStyle = new Ansis();
const bench = new Bench({
    minOpsWidth: 12,
    suiteNameColor: benchStyle.bgYellow.black,
    benchNameColor: benchStyle.magenta,
    opsColor: benchStyle.greenBright,
    rmeColor: benchStyle.cyan,
    statUnitColor: benchStyle.dim,
    failColor: benchStyle.red.bold,
});

// colors present in all libraries
const baseColors = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"];

let fixture = [];

log(colorize.hex("#F88").inverse.bold` -= Benchmark =- `);

log(` -= Deep Nested Styling =- `);

showSupportOfDeepNestedStyling();

log(` -= Deep Nested Chained Styling =- `);

showSupportOfDeepNestedChainedStyling();

log(` -= Break Style At NewLine =- `);

showSupportOfBreakStyleAtNewLine();

// Supports the template literals
log(chalk.red`red ${chalk.yellow`yellow ${chalk.green`green`} yellow`} red`); // fail
log(kleur.red`red ${kleur.yellow`yellow ${kleur.green`green`} yellow`} red`); // fail
log(colorsJs.red`red ${colorsJs.yellow`yellow ${colorsJs.green`green`} yellow`} red`); // fail
log(colorette.red`red ${colorette.yellow`yellow ${colorette.green`green`} yellow`} red`); // fail
log(ansiColors.red`red ${ansiColors.yellow`yellow ${ansiColors.green`green`} yellow`} red`); // fail
log(cliColor.red`red ${cliColor.yellow`yellow ${cliColor.green`green`} yellow`} red`); // fail
// log(colorCli.red`red ${colorCli.yellow`yellow ${colorCli.green`green`} yellow`} red`); // fail
log(picocolors.red`red ${picocolors.yellow`yellow ${picocolors.green`green`} yellow`} red`); // fail
log(red`red ${yellow`yellow ${green`green`} yellow`} red`); // OK
log(colorize.red`red ${colorize.yellow`yellow ${colorize.green`green`} yellow`} red`); // OK

// Colorette bench
// https://github.com/jorgebucaran/colorette/blob/main/bench/index.js
fixture = createFixture(vendors, coloretteBench);
bench("Colorette bench")
    .add(vendors[0].name, () => fixture[0](vendors[0].lib))
    .add(vendors[1].name, () => fixture[1](vendors[1].lib))
    .add(vendors[2].name, () => fixture[2](vendors[2].lib))
    .add(vendors[3].name, () => fixture[3](vendors[3].lib))
    .add(vendors[4].name, () => fixture[4](vendors[4].lib))
    .add(vendors[5].name, () => fixture[5](vendors[5].lib))
    .add(vendors[6].name, () => fixture[6](vendors[6].lib))
    .add(vendors[7].name, () => fixture[7](vendors[7].lib))
    .add(vendors[8].name, () => fixture[8](vendors[8].lib))
    .add(vendors[9].name, () => fixture[9](vendors[9].lib))
    // .add(vendors[10].name, () => fixture[10](vendors[10].lib))
    //.add('chalk', () => chalk.red(`${chalk.bold(`${chalk.cyan(`${chalk.yellow('yellow')}cyan`)}`)}red`))
    //.add('ansis', () => ansis.red(`${ansis.bold(`${ansis.cyan(`${ansis.yellow('yellow')}cyan`)}`)}red`))
    .run();

// Base colors
bench("Base colors")
    .add("colors-js", () => baseColors.forEach((style) => colorsJs[style]("foo")))
    .add("colorette", () => baseColors.forEach((style) => colorette[style]("foo")))
    .add("picocolors", () => baseColors.forEach((style) => picocolors[style]("foo")))
    .add("cli-color", () => baseColors.forEach((style) => cliColor[style]("foo")))
    .add("color-cli", () => baseColors.forEach((style) => colorCli[style]("foo")))
    .add("ansi-colors", () => baseColors.forEach((style) => ansiColors[style]("foo")))
    .add("kleur/colors", () => baseColors.forEach((style) => kleurColors[style]("foo")))
    .add("kleur", () => baseColors.forEach((style) => kleur[style]("foo")))
    .add("chalk", () => baseColors.forEach((style) => chalk[style]("foo")))
    .add("ansis", () => baseColors.forEach((style) => ansis[style]("foo")))
    .add("visulima/colorize", () => baseColors.forEach((style) => colorize[style]("foo")))
    .run();

// Chained styles
bench("Chained styles")
    .add("colors-js", () => baseColors.forEach((style) => colorsJs[style].bold.underline.italic("foo")))
    .add("colorette (not supported)", () => baseColors.forEach((style) => colorette[style].bold.underline.italic("foo")))
    .add("picocolors (not supported)", () => baseColors.forEach((style) => picocolors[style].bold.underline.italic("foo")))
    .add("cli-color", () => baseColors.forEach((style) => cliColor[style].bold.underline.italic("foo")))
    .add("color-cli", () => baseColors.forEach((style) => colorCli[style].bold.underline.italic("foo")))
    .add("ansi-colors", () => baseColors.forEach((style) => ansiColors[style].bold.underline.italic("foo")))
    .add("kleur/colors (not supported)", () => baseColors.forEach((style) => kleurColors[style].bold.underline.italic("foo")))
    .add("kleur", () => baseColors.forEach((style) => kleur[style]().bold().underline().italic("foo"))) // alternate syntax
    .add("chalk", () => baseColors.forEach((style) => chalk[style].bold.underline.italic("foo")))
    .add("ansis", () => baseColors.forEach((style) => ansis[style].bold.underline.italic("foo")))
    .add("visulima/colorize", () => baseColors.forEach((style) => colorize[style].bold.underline.italic("foo")))
    .run();

// Nested calls
bench("Nested calls")
    .add("colors-js", () => baseColors.forEach((style) => colorsJs[style](colorsJs.bold(colorsJs.underline(colorsJs.italic("foo"))))))
    .add("colorette", () => baseColors.forEach((style) => colorette[style](colorette.bold(colorette.underline(colorette.italic("foo"))))))
    .add("picocolors", () => baseColors.forEach((style) => picocolors[style](picocolors.bold(picocolors.underline(picocolors.italic("foo"))))))
    .add("cli-color", () => baseColors.forEach((style) => cliColor[style](cliColor.bold(cliColor.underline(cliColor.italic("foo"))))))
    .add("color-cli", () => baseColors.forEach((style) => colorCli[style](colorCli.bold(colorCli.underline(colorCli.italic("foo"))))))
    .add("ansi-colors", () => baseColors.forEach((style) => ansiColors[style](ansiColors.bold(ansiColors.underline(ansiColors.italic("foo"))))))
    .add("kleur/colors", () => baseColors.forEach((style) => kleurColors[style](kleurColors.bold(kleurColors.underline(kleurColors.italic("foo"))))))
    .add("kleur", () => baseColors.forEach((style) => kleur[style](kleur.bold(kleur.underline(kleur.italic("foo"))))))
    .add("chalk", () => baseColors.forEach((style) => chalk[style](chalk.bold(chalk.underline(chalk.italic("foo"))))))
    .add("ansis", () => baseColors.forEach((style) => ansis[style](ansis.bold(ansis.underline(ansis.italic("foo"))))))
    .add("visulima/colorize", () => baseColors.forEach((style) => colorize[style](colorize.bold(colorize.underline(colorize.italic("foo"))))))
    .run();

// Nested styles
fixture = createFixture(vendors, nestedFixture);
bench("Nested styles")
    .add("colors.js", () => fixture[9](colorsJs))
    .add("colorette", () => fixture[0](colorette))
    .add("picocolors", () => fixture[1](picocolors))
    .add("cli-color", () => fixture[2](cliColor))
    .add("color-cli", () => fixture[3](colorCli))
    .add("ansi-colors", () => fixture[4](ansiColors))
    .add("kleur/colors", () => fixture[5](kleurColors))
    .add("kleur", () => fixture[6](kleur))
    .add("chalk", () => fixture[7](chalk))
    .add("ansis", () => fixture[8](ansis))
    .add("visulima/colorize", () => fixture[8](colorize))
    .run();

// Deep nested styles
fixture = createFixture(vendors, deepNestedFixture);
bench("Deep nested styles")
    .add("colors.js", () => fixture[9](colorsJs))
    .add("colorette", () => fixture[0](colorette))
    .add("picocolors", () => fixture[1](picocolors))
    .add("cli-color", () => fixture[2](cliColor))
    .add("color-cli", () => fixture[3](colorCli))
    .add("ansi-colors", () => fixture[4](ansiColors))
    .add("kleur/colors", () => fixture[5](kleurColors))
    .add("kleur", () => fixture[6](kleur))
    .add("chalk", () => fixture[7](chalk))
    .add("ansis", () => fixture[8](ansis))
    .add("visulima/colorize", () => fixture[8](colorize))
    .run();

// Check support of correct break style at new line

// Break style at new line
bench('New Line')
  .add('colors.js', () => colorsJs.bgGreen(`\nAnsis\nNEW LINE\nNEXT NEW LINE\n`))
  .add('ansi-colors', () => ansiColors.bgGreen(`\nAnsis\nNEW LINE\nNEXT NEW LINE\n`))
  .add('chalk', () => chalk.bgGreen(`\nAnsis\nNEW LINE\nNEXT NEW LINE\n`))
  .add('ansis', () => ansis.bgGreen(`\nAnsis\nNEW LINE\nNEXT NEW LINE\n`))
  .add("visulima/colorize", () => colorize.bgGreen(`\nAnsis\nNEW LINE\nNEXT NEW LINE\n`))
  .run();

bench("RGB colors")
    .add("chalk", () => {
        for (let i = 0; i < 256; i++) chalk.rgb(i, 150, 200)("foo");
    })
    .add("ansis", () => {
        for (let i = 0; i < 256; i++) ansis.rgb(i, 150, 200)("foo");
    })
    .add("visulima/colorize", () => {
        for (let i = 0; i < 256; i++) colorize.rgb(i, 150, 200)("foo");
    })
    .run();

// HEX colors
// the hex(), rgb(), bgHex(), bgRgb() methods support only chalk and ansis
bench("HEX colors")
    .add("chalk", () => chalk.hex("#FBA")("foo"))
    .add("ansis", () => ansis.hex("#FBA")("foo"))
    .add("visulima/colorize", () => colorize.hex("#FBA")("foo"))
    .run();

// Template literals
bench("Template literals")
    .add("ansis", () => red`red ${yellow`yellow ${green`green`} yellow`} red`)
    .add("visulima/colorize", () => red`red ${yellow`yellow ${green`green`} yellow`} red`)
    .run();

function coloretteBench(c) {
    return c.red(`${c.bold(`${c.cyan(`${c.yellow("yellow")}cyan`)}`)}red`);
}

function nestedFixture(c) {
    return c.red(
        `a red ${c.white("white")} red ${c.red("red")} red ${c.cyan("cyan")} red ${c.black("black")} red ${c.red("red")} red ${c.green("green")} red ${c.red(
            "red",
        )} red ${c.yellow("yellow")} red ${c.blue("blue")} red ${c.red("red")} red ${c.magenta("magenta")} red ${c.red("red")} red ${c.red("red")} red ${c.red(
            "red",
        )} red ${c.red("red")} red ${c.red("red")} red ${c.red("red")} red ${c.red("red")} red ${c.red("red")} red ${c.red("red")} red ${c.red(
            "red",
        )} red ${c.red("red")} red ${c.red("red")} red ${c.red("red")} red ${c.red("red")} red ${c.red("red")} red ${c.green("green")} red ${c.red(
            "red",
        )} red ${c.red("red")} red ${c.red("red")} red ${c.red("red")} red ${c.red("red")} red ${c.red("red")} red ${c.red("red")} red ${c.red(
            "red",
        )} red ${c.red("red")} red ${c.red("red")} red ${c.magenta("magenta")} red ${c.red("red")} red ${c.red("red")} red ${c.cyan("cyan")} red ${c.red(
            "red",
        )} red ${c.red("red")} red ${c.yellow("yellow")} red ${c.red("red")} red ${c.red("red")} red ${c.red("red")} red ${c.red("red")} red ${c.red(
            "red",
        )} red ${c.red("red")} red ${c.red("red")} message`,
    );
}

function deepNestedFixture(c) {
    return c.green(
        `green ${c.cyan(
            `cyan ${c.red(
                `red ${c.yellow(
                    `yellow ${c.blue(`blue ${c.magenta(`magenta ${c.underline(`underline ${c.italic(`italic`)} underline`)} magenta`)} blue`)} yellow`,
                )} red`,
            )} cyan`,
        )} green`,
    );
}

function complexNestedFixture(c) {
    return c.red(
        `red ${c.yellow("yellow")} red ${c.italic.cyan("italic cyan")} red ${c.underline.green(
            `underline green ${c.yellow("underline yellow")} underline green`,
        )} red ${c.cyan("cyan")} red ${c.bold.yellow("bold yellow")} red ${c.green("green")} red`,
    );
}

function showSupportOfDeepNestedStyling() {
    log("logcolors.js: ", deepNestedFixture(colorsJs));
    log("logcolorette: ", deepNestedFixture(colorette));
    log("picocolors: ", deepNestedFixture(picocolors));
    log("cli-color: ", deepNestedFixture(cliColor));
    // log("color-cli: ", deepNestedFixture(colorCli)); // buggy
    log("ansi-colors: ", deepNestedFixture(ansiColors));
    log("kleur/colors: ", deepNestedFixture(kleurColors));
    log("kleur: ", deepNestedFixture(kleur));
    log("chalk: ", deepNestedFixture(chalk));
    log("ansis: ", deepNestedFixture(ansis));
    log("@visulima/colorize: ", deepNestedFixture(colorize));
}

function showSupportOfDeepNestedChainedStyling() {
    log("chalk: ", complexNestedFixture(chalk));
    log("ansis: ", complexNestedFixture(ansis));
    log("@visulima/colorize: ", complexNestedFixture(colorize));
}

function showSupportOfBreakStyleAtNewLine() {
    log("colors.js: ", colorsJs.bgGreen(`\nAnsis\nNEW LINE\nNEXT NEW LINE\n`)); // OK
    log("colorette: ", colorette.bgGreen(`\nAnsis\nNEW LINE\nNEXT NEW LINE\n`)); // (not supported)
    log("picocolors: ", picocolors.bgGreen(`\nAnsis\nNEW LINE\nNEXT NEW LINE\n`)); // (not supported)
    log("cli-color: ", cliColor.bgGreen(`\nAnsis\nNEW LINE\nNEXT NEW LINE\n`)); // (not supported)
    // log("color-cli: ", colorCli.green_b(`\nAnsis\nNEW LINE\nNEXT NEW LINE\n`)); // (not supported)
    log("ansi-colors: ", ansiColors.bgGreen(`\nAnsis\nNEW LINE\nNEXT NEW LINE\n`)); // OK
    log("kleur/colors: ", kleurColors.bgGreen(`\nAnsis\nNEW LINE\nNEXT NEW LINE\n`)); // (not supported)
    log("kleur: ", kleur.bgGreen(`\nAnsis\nNEW LINE\nNEXT NEW LINE\n`)); // (not supported)
    log("chalk: ", chalk.bgGreen(`\nAnsis\nNEW LINE\nNEXT NEW LINE\n`)); // OK
    log("ansis: ", ansis.bgGreen(`\nAnsis\nNEW LINE\nNEXT NEW LINE\n`)); // OK
    log("@visulima/colorize: ", colorize.bgGreen(`\nAnsis\nNEW LINE\nNEXT NEW LINE\n`)); // OK
}
