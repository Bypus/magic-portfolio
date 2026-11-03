const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const cache = new Map();

function loadTS(file) {
  const absolute = path.resolve(__dirname, "..", file);
  if (cache.has(absolute)) return cache.get(absolute);
  const exports = {};
  cache.set(absolute, exports);
  const source = ts.transpileModule(fs.readFileSync(absolute, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  new Function("require", "exports", source)((name) => {
    if (name.startsWith("@/")) return loadTS(`src/${name.slice(2)}.ts`);
    if (name.startsWith(".")) return loadTS(path.relative(path.resolve(__dirname, ".."), path.resolve(path.dirname(absolute), `${name}.ts`)));
    return require(name);
  }, exports);
  return exports;
}

module.exports = { loadTS };
