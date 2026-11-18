"use strict";
const assert = require("node:assert/strict");
(async () => {
 const i18n = await import("../frontend/src/i18n.mjs");
 const {translations, supportedLanguages, normalizeLanguage, resolveLanguage, savedLanguage, translate, formatNumber, formatDateTime, describeError, LocalizedError} = i18n;
 const codes = ["en", "ru", "es", "pt-BR", "de", "fr", "pl"];
 assert.deepEqual(supportedLanguages.map(item => item.code), codes);
 const placeholders = text => (text.match(/\{\w+\}/g) || []).sort();
 for (const code of codes) {
  assert.deepEqual(Object.keys(translations[code]).sort(), Object.keys(translations.en).sort(), code);
  for (const [key, value] of Object.entries(translations[code])) {
   assert.equal(typeof value,"string"); assert.ok(value.trim(), `${code}:${key}`);
   assert.doesNotMatch(value,/\?{2,}|\uFFFD/,`${code}:${key}`);
   assert.deepEqual(placeholders(value), placeholders(translations.en[key]), `${code}:${key}`);
  }
  assert.ok(formatDateTime(code, "2026-11-18T12:30:00Z").includes("2026"));
  assert.equal(formatDateTime(code,"bad date"),"—");
  assert.deepEqual(describeError(new Error(translate(code,"errorRevision")),"saveError"), {key:"errorRevision",values:{}});
  const bounds={field:"title",minimum:1,maximum:20000};
  assert.deepEqual(describeError(new Error(translate(code,"errorTextLength",bounds))), {key:"errorTextLength",values:bounds});
 }
 for (const [input,expected] of [["EN-gb","en"],["ru_RU","ru"],["es-MX","es"],["pt","pt-BR"],["PT_br","pt-BR"],["de-DE","de"],["fr-CA","fr"],["pl-PL","pl"],["ja",null],["constructor",null],[null,null]]) assert.equal(normalizeLanguage(input),expected);
 assert.deepEqual(resolveLanguage({manual:"ru",hermes:"fr",browser:["de"]}),{language:"ru",source:"Manual"});
 assert.deepEqual(resolveLanguage({hermes:"es-MX",browser:["de"]}),{language:"es",source:"Hermes"});
 assert.deepEqual(resolveLanguage({hermes:"ja",browser:["de"]}),{language:"en",source:"Fallback"});
 assert.deepEqual(resolveLanguage({hermes:undefined,browser:["ja","pt-BR"]}),{language:"pt-BR",source:"Browser"});
 assert.deepEqual(resolveLanguage({browser:["ja"]}),{language:"en",source:"Fallback"});
 assert.deepEqual(resolveLanguage({browser:[]}),{language:"en",source:"Fallback"});
 const descriptor=Object.getOwnPropertyDescriptor(globalThis,"navigator");
 Object.defineProperty(globalThis,"navigator",{configurable:true,value:{languages:["en-US"]}});
 for (const stored of [null,"auto","invalid","constructor"]) {global.localStorage={getItem:()=>stored};assert.equal(savedLanguage(),"en");}
 global.localStorage={getItem:()=>"ru"};assert.equal(savedLanguage(),"ru");
 global.localStorage={getItem(){throw Error("blocked");}};assert.equal(savedLanguage(),"en");
 delete global.localStorage;
 if (descriptor) Object.defineProperty(globalThis,"navigator",descriptor);else delete globalThis.navigator;
 assert.equal(translate("en","progress",{done:2,total:5}),"2 of 5 completed");
 assert.equal(translate("ru","progress",{done:2,total:5}),"2 из 5 выполнено");
 assert.equal(translate("unknown","heading"),"My Tasks");
 const saved=translations.fr.save;delete translations.fr.save;assert.equal(translate("fr","save"),"Save");translations.fr.save=saved;
 assert.equal(translate("fr","unknownKey"),"unknownKey");assert.equal(translate("fr","constructor"),"constructor");
 assert.equal(formatNumber("en",12345.6),"12,345.6");assert.equal(formatNumber("de",12345.6),"12.345,6");
 assert.equal(formatNumber("pt-BR",12345.6),"12.345,6");assert.match(formatNumber("fr",12345.6),/^12\s345,6$/u);
 assert.deepEqual(describeError(new LocalizedError("connectionChanged")),{key:"connectionChanged",values:{}});
 assert.deepEqual(describeError(new Error("Untranslated host exception")),{key:"requestError",values:{}});
 const {createController}=await import("../frontend/src/state.mjs");
 const prefs=new Map(), storage={getItem:key=>prefs.get(key)||null,setItem:(key,value)=>prefs.set(key,value)};
 const c=createController({storage,hermesLanguage:"es",browserLanguages:["ru"]});
 assert.equal(c.getSnapshot().language,"es");assert.equal(c.getSnapshot().languagePreference,"auto");
 c.inheritLanguage("fr",["de"]);assert.equal(c.getSnapshot().language,"fr");
 c.language("pt-BR");c.inheritLanguage("de",["es"]);assert.equal(c.getSnapshot().language,"pt-BR");
 assert.equal(createController({storage,hermesLanguage:"pl"}).getSnapshot().language,"pt-BR");
 c.language("auto");assert.equal(c.getSnapshot().language,"de");
 assert.equal(createController({storage,hermesLanguage:"pl"}).getSnapshot().language,"pl");
 c.inheritLanguage(undefined,["fr-CA"]);assert.equal(c.getSnapshot().language,"fr");
 prefs.set("ptm.language","pl");c.syncLanguagePreference();assert.equal(c.getSnapshot().language,"pl");
 prefs.set("ptm.language","auto");c.syncLanguagePreference();assert.equal(c.getSnapshot().language,"fr");
 const blocked=createController({storage:{getItem(){throw Error("blocked");},setItem(){throw Error("blocked");}},browserLanguages:["pl"]});
 blocked.language("es");blocked.syncLanguagePreference();assert.equal(blocked.getSnapshot().language,"es");blocked.language("auto");assert.equal(blocked.getSnapshot().language,"pl");
 const errors=createController({storage:{getItem:()=>null},browserLanguages:["es"],transport:async()=>{throw new Error(translations.ru.errorRevision);}});
 await errors.refresh();assert.equal(errors.getSnapshot().error,translations.es.errorRevision);
 errors.language("de");assert.equal(errors.getSnapshot().error,translations.de.errorRevision);
 errors.dispose();c.dispose();blocked.dispose();
 console.log("PASS: seven complete catalogs, normalization, precedence, persistence, inheritance, English fallback, Intl formatting and live error translation");
})().catch(error=>{console.error(error);process.exitCode=1;});
