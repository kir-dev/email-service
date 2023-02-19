import jwt from "jsonwebtoken";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { Key } from "./mw/authMW";
import * as readline from "readline";
require("dotenv").config();

const filename = "keys.json";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function run() {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    console.error("JWT_SECRET is empty!");
    return;
  }
  let keys: Key[] = [];
  if (existsSync(filename)) {
    const keysFile = readFileSync("keys.json");
    const parsedFile = JSON.parse(keysFile.toString());
    if (Array.isArray(parsedFile)) keys = parsedFile;
  }
  rl.question("App name? ", (name) => {
    const generatedToken = jwt.sign({ name }, JWT_SECRET);
    console.info(`Token for ${name}: ${generatedToken}`);
    keys.push({ name, key: generatedToken });
    writeFileSync(filename, JSON.stringify(keys));
    console.info("Key saved!");
    process.exit();
  });
}

run();
