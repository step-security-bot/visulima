#!/usr/bin/env node

import { hex } from "@visulima/colorize";

let str = "";

[
  '#ff0000',
  '#ff0021',
  '#ff0041',
  '#ff0062',
  '#ff0082',
  '#ff00a3',
  '#ff00c3',
  '#ff00e4',
  '#fa00ff',
  '#d900ff',
  '#b900ff',
  '#9800ff',
  '#7800ff',
  '#5700ff',
  '#3700ff',
  '#1600ff',
  '#000bff',
  '#002bff',
  '#004cff',
  '#006cff',
  '#008dff',
  '#00adff',
  '#00ceff',
  '#00eeff',
  '#00ffef',
  '#00ffcf',
  '#00ffae',
  '#00ff8e',
  '#00ff6d',
  '#00ff4d',
  '#00ff2c',
  '#00ff0c',
  '#15ff00',
  '#36ff00',
  '#56ff00',
  '#77ff00',
  '#97ff00',
  '#b8ff00',
  '#d8ff00',
  '#f9ff00',
  '#ffe500',
  '#ffc400',
  '#ffa400',
  '#ff8300',
  '#ff6300',
  '#ff4200',
  '#ff2200',
  '#ff0100',
].forEach((color) => {
    str += hex(color)("█");
});

console.log();
console.log(str);
console.log();
