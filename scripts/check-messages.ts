import { IntlMessageFormat } from "intl-messageformat";
import english from "../messages/en.json";
import spanish from "../messages/es.json";
import { achievementCategories, achievementMilestones } from "../src/lib/achievements";
import { managerAwardIds } from "../src/lib/awards";
import { badgeIds, levels } from "../src/lib/progression";

type Tree = { [key: string]: string | Tree };

const problems: string[] = [];

function leaves(tree: Tree, prefix = "", out: Record<string, string> = {}) {
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") out[path] = value;
    else leaves(value, path, out);
  }
  return out;
}

function placeholders(message: string) {
  return [...message.matchAll(/\{([a-zA-Z_][a-zA-Z0-9_]*)/g)].map((match) => match[1]).sort();
}

const en = leaves(english);
const es = leaves(spanish);

for (const key of Object.keys(en)) {
  if (!(key in es)) problems.push(`Spanish is missing ${key}`);
}
for (const key of Object.keys(es)) {
  if (!(key in en)) problems.push(`English is missing ${key}`);
}
for (const key of Object.keys(en)) {
  if (!(key in es)) continue;
  const left = placeholders(en[key]).join(",");
  const right = placeholders(es[key]).join(",");
  if (left !== right) problems.push(`${key} placeholders differ (en: ${left || "none"}, es: ${right || "none"})`);
  for (const [locale, message] of [["en", en[key]], ["es", es[key]]] as const) {
    try {
      new IntlMessageFormat(message, locale);
    } catch (error) {
      problems.push(`${locale} ${key} is not valid: ${error instanceof Error ? error.message : error}`);
    }
  }
}

function requireKey(path: string) {
  if (!(path in en)) problems.push(`Missing message ${path}`);
}

for (const id of badgeIds) {
  requireKey(`badges.${id}.name`);
  requireKey(`badges.${id}.detail`);
}
for (const id of managerAwardIds) {
  requireKey(`awards.${id}.name`);
  requireKey(`awards.${id}.detail`);
}
for (const level of levels) requireKey(`progress.levels.${level.id}`);
for (const category of achievementCategories) {
  requireKey(`achievements.${category}.title`);
  requireKey(`achievements.${category}.description`);
  requireKey(`achievements.${category}.milestone`);
  for (const target of achievementMilestones) requireKey(`achievements.${category}.names.${target}`);
}
for (const step of ["map", "volunteer", "community", "growth"]) {
  requireKey(`start.${step}Title`);
  requireKey(`start.${step}Body`);
  requireKey(`start.${step}Action`);
}
for (const way of ["waysBed", "waysVolunteer", "waysEvents", "waysProduce", "waysLearn"]) {
  requireKey(`garden.${way}`);
}
for (const code of ["email", "password", "required", "taken", "invalid_login", "generic", "denied", "size", "empty"]) {
  requireKey(`errors.${code}`);
}
for (const type of ["hero", "about", "gallery", "upcoming_events", "ways", "tools", "getting_here", "announcements", "contact"]) {
  requireKey(`builder.${type}`);
}
for (const category of ["workday", "workshop", "meal", "meeting", "other"]) {
  requireKey(`events.${category}`);
}

if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}

console.log(`Messages ok: ${Object.keys(en).length} English and Spanish phrases.`);
