import en from "../../locales/en.json" with {type: "json"};
import ru from "../../locales/ru.json" with {type: "json"};
import es from "../../locales/es.json" with {type: "json"};
import ptBR from "../../locales/pt-BR.json" with {type: "json"};
import de from "../../locales/de.json" with {type: "json"};
import fr from "../../locales/fr.json" with {type: "json"};
import pl from "../../locales/pl.json" with {type: "json"};

// JSON catalogs are shared with the Python HTTP adapter. Add a catalog here to
// expose another language; resolution, settings and formatting are data-driven.
export const translations = {en, ru, es, "pt-BR": ptBR, de, fr, pl};
export const supportedLanguages = Object.entries(translations).map(([code, catalog]) => ({code, name: catalog.languageName}));
export const LANGUAGE_KEY = "ptm.language";

export function normalizeLanguage(value) {
  if (typeof value !== "string") return null;
  const tag = value.split(",")[0].split(";")[0].trim().replaceAll("_", "-").toLowerCase();
  const exact = supportedLanguages.find(item => item.code.toLowerCase() === tag);
  if (exact) return exact.code;
  const base = tag.split("-")[0];
  if (base === "pt") return "pt-BR";
  return Object.hasOwn(translations, base) ? base : null;
}
export function browserLanguages() {
  const nav = globalThis.window?.navigator || globalThis.navigator;
  return nav?.languages?.length ? [...nav.languages] : nav?.language ? [nav.language] : [];
}
export function languageStorage() {try {return globalThis.localStorage || globalThis.window?.localStorage;} catch {return undefined;}}
export function languagePreference(storage = languageStorage()) {
  try {return normalizeLanguage(storage?.getItem(LANGUAGE_KEY));} catch {return null;}
}
export function resolveLanguage({manual, hermes, browser = browserLanguages()} = {}) {
  const selected = normalizeLanguage(manual);
  if (selected) return {language: selected, source: "Manual"};
  if (typeof hermes === "string" && hermes.trim() && hermes.toLowerCase() !== "auto") {
    const inherited = normalizeLanguage(hermes);
    return {language: inherited || "en", source: inherited ? "Hermes" : "Fallback"};
  }
  for (const candidate of Array.isArray(browser) ? browser : [browser]) {
    const inherited = normalizeLanguage(candidate);
    if (inherited) return {language: inherited, source: "Browser"};
  }
  return {language: "en", source: "Fallback"};
}
export function savedLanguage() {return resolveLanguage({manual: languagePreference()}).language;}
export function localeFor(language) {return translations[normalizeLanguage(language) || "en"].locale;}
export function formatNumber(language, value) {return new Intl.NumberFormat(localeFor(language)).format(value);}
export function formatDateTime(language, stamp) {
  const date = new Date(stamp);
  return Number.isNaN(date.valueOf()) ? "—" : new Intl.DateTimeFormat(localeFor(language), {dateStyle: "medium", timeStyle: "short"}).format(date);
}
export function translate(language, key, values = {}) {
  const code = normalizeLanguage(language) || "en", catalog = translations[code];
  const message = (Object.hasOwn(catalog, key) && catalog[key]) || (Object.hasOwn(en, key) && en[key]) || key;
  return message.replace(/\{(\w+)\}/g, (_, name) => {
    const value = values[name];
    if (value === undefined) return `{${name}}`;
    if (name === "field") return catalog[`field.${value}`] || en[`field.${value}`] || String(value);
    return typeof value === "number" ? formatNumber(code, value) : String(value);
  });
}
export class LocalizedError extends Error {
  constructor(key, values = {}) {super(translate("en", key, values)); this.key = key; this.values = values;}
}
const escape = text => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// Both Hermes transports surface HTTP details as Error.message. Recognize our
// catalog messages, retain their semantic key, and re-render even if a response
// in the previous language arrives after the user has changed the language.
const errorPatterns = Object.values(translations).flatMap(catalog => Object.entries(catalog)
  .filter(([key]) => key.startsWith("error") || ["connectionChanged", "requestError", "saveError"].includes(key))
  .map(([key, message]) => {
    const names = [];
    const pattern = message.split(/(\{\w+\})/).map(part => {
      if (/^\{\w+\}$/.test(part)) {names.push(part.slice(1, -1)); return "(.+?)";}
      return escape(part);
    }).join("");
    return {key, names, pattern: new RegExp(`^${pattern}$`), catalog};
  }));
export function describeError(error, fallback = "requestError") {
  if (error instanceof LocalizedError && Object.hasOwn(en, error.key)) return {key: error.key, values: error.values};
  for (const entry of errorPatterns) {
    const match = entry.pattern.exec(error?.message || "");
    if (!match) continue;
    const values = {};
    entry.names.forEach((name, index) => {
      const value = match[index + 1];
      if (name === "field") values[name] = Object.keys(entry.catalog).find(key => key.startsWith("field.") && entry.catalog[key] === value)?.slice(6) || value;
      else if (["minimum", "maximum", "count"].includes(name)) values[name] = Number(value.replace(/[,\.\s\u00a0\u202f]/g, ""));
      else values[name] = value;
    });
    return {key: entry.key, values};
  }
  return {key: fallback, values: {}};
}
