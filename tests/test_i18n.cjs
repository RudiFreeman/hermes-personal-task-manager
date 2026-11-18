"use strict";
const assert = require("node:assert/strict");
const {translations, savedLanguage, translate} = require("../dashboard/dist/index.js");

assert.deepEqual(Object.keys(translations.en).sort(), Object.keys(translations.ru).sort());
for (const key of Object.keys(translations.en)) {
  const placeholders = text => (text.match(/\{\w+\}/g) || []).sort();
  assert.deepEqual(placeholders(translations.en[key]), placeholders(translations.ru[key]), key);
  assert.ok(translations.en[key].trim() && translations.ru[key].trim(), key);
}
global.localStorage = {getItem: () => null};
assert.equal(savedLanguage(), "en");
global.localStorage = {getItem: () => "ru"};
assert.equal(savedLanguage(), "ru");
global.localStorage = {getItem: () => "unsupported"};
assert.equal(savedLanguage(), "en");
global.localStorage = {getItem: () => "constructor"};
assert.equal(savedLanguage(), "en");
global.localStorage = {getItem: () => {throw new Error("Storage blocked");}};
assert.equal(savedLanguage(), "en");
delete global.localStorage;
assert.equal(savedLanguage(), "en");
assert.equal(translate("en", "progress", {done: 2, total: 5}), "2 of 5 completed");
assert.equal(translate("ru", "progress", {done: 2, total: 5}), "2 из 5 выполнено");
assert.equal(translate("unknown", "heading"), "My Tasks");
assert.equal(translate("ru", "missingKey"), "missingKey");
console.log("PASS: locale coverage, interpolation, English default, stored preference, and storage fallback");
