"use strict";

import property from "lodash";
const _ = property;
import { readFile as _readFile, writeFile as _writeFile } from "fs";
import argv from "yargs";
import { promisify } from "util";
import stripComments from "strip-json-comments";
import { config } from "process";

const readFile = promisify(_readFile);
const writeFile = promisify(_writeFile);
const { definition } = argv;

const def = process.argv[2].split("=")[1];
const isObject = (obj) => obj && typeof obj === "object";
let configFile = readFile(def, "utf-8");
let theme;
if (!configFile) {
  console.error("Please provide target definition file");
  console.error();
  process.exit(1);
}

console.error("Processing definition file please wait..!");

const resolveConstants = (obj) => {
  if (!isObject(obj)) {
    return obj;
  }
  const themeValue = new RegExp(/^\${theme/);
  const massageString = (stringReference) => {
    return stringReference
      .replace(/['"]+/g, "")
      .replace(/\${/, "")
      .replace(/}/, "");
  };

  const resolveAttributes = (params) => {
    const resolvedConfig = {};
    Object.keys(params || {}).forEach((key) => {
      const value = params[key];
      if (themeValue.test(value)) {
        resolvedConfig[key] = _.property(massageString(value))(theme);
      } else {
        if (Array.isArray(value)) {
          let valueList = [];
          for (let item of value) {
            valueList.push(resolveAttributes(item));
          }
          resolvedConfig[key] = valueList;
        } else if (typeof value === "object" && value !== null) {
          resolvedConfig[key] = resolveAttributes(value);
        } else {
          resolvedConfig[key] = value;
        }
      }
    });
    return resolvedConfig;
  };

  return resolveAttributes(obj);
};

async function writeOutput() {
  let outputFile = def.replace(/\.json$/i, ".parsed.json");
  let configFileData = await configFile;
  theme = JSON.parse(stripComments(configFileData));
  let parsedData = resolveConstants(theme);
  let output = JSON.stringify(parsedData);
  return writeFile(outputFile, output);
}

writeOutput();
