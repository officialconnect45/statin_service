// Recipient sheet: one row per email, extra columns fill the template's {{variables}}.
// Pure parsing, shared by the outreach form; the API only ever sees aligned arrays.

export const EMAIL_IN_TEXT = /[^\s@<>,;:"'()[\]]+@[^\s@<>,;:"'()[\]]+\.[^\s@<>,;:"'()[\]]+/g;
const HAS_EMAIL = /[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+/;
export const EMAIL = /^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/;

// {{name}} placeholders in the subject/message. Must match VARIABLE in apps/api/src/routes/outreach.ts
const VARIABLE = /\{\{\s*([a-z_][a-z0-9_]*)\s*\}\}/gi;

export const variablesIn = (...texts: string[]) => [
  ...new Set(texts.flatMap((value) => [...value.matchAll(VARIABLE)].map((m) => m[1].toLowerCase()))),
];

export const fillVariables = (value: string, values: Record<string, string>) =>
  value.replace(VARIABLE, (whole, name: string) => values[name.toLowerCase()] || whole);

export type Row = { email: string; values: Record<string, string> };

export type ParsedSheet = {
  /** Valid, de-duplicated rows in the order given. */
  rows: Row[];
  /** Lines with no email address: 1-based line numbers in the text. */
  invalid: number[];
  duplicates: number;
  /** Column names from a header row, if the first line had no email in it. */
  header: string[] | null;
};

const clean = (cell: string) => cell.trim().replace(/^"(.*)"$/, "$1").trim();
const columnName = (cell: string) => clean(cell).toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/^_+|_+$/g, "");

function cellsOf(line: string) {
  if (line.includes("\t")) return line.split("\t").map(clean);
  // "a@x.com, b@y.com": a plain list of addresses, each is its own row.
  const emails = line.match(EMAIL_IN_TEXT);
  if (emails && emails.length > 1) return null;
  return line.split(/[,;]/).map(clean);
}

/**
 * Reads pasted/uploaded text as a table. Columns are found by a header row
 * (e.g. `email, website`) or, without one, by position: the email can be in
 * any column and the remaining columns fill the template variables in order.
 */
export function parseSheet(text: string, variableNames: string[]): ParsedSheet {
  const lines = text.split(/\r?\n/).map((raw, index) => ({ raw: raw.trim(), line: index + 1 })).filter((l) => l.raw);
  const rows: Row[] = [];
  const invalid: number[] = [];
  const seen = new Set<string>();
  let duplicates = 0;
  let header: string[] | null = null;
  let headerEmailIdx = 0;

  lines.forEach(({ raw, line }, index) => {
    const cells = cellsOf(raw);
    if (cells === null) {
      for (const email of raw.match(EMAIL_IN_TEXT) ?? []) add(email.toLowerCase(), []);
      return;
    }
    if (index === 0 && !cells.some((cell) => HAS_EMAIL.test(cell))) {
      header = cells.map(columnName);
      const found = header.findIndex((name) => name.includes("mail"));
      headerEmailIdx = found === -1 ? 0 : found;
      return;
    }
    let emailIdx = cells.findIndex((cell) => EMAIL.test(cell));
    let email = emailIdx === -1 ? "" : cells[emailIdx];
    if (!email) {
      email = raw.match(EMAIL_IN_TEXT)?.[0] ?? "";
      emailIdx = -1;
    }
    if (!email) {
      invalid.push(line);
      return;
    }
    add(email.toLowerCase(), cells, emailIdx);
  });

  function add(email: string, cells: string[], emailIdx = cells.findIndex((c) => c.toLowerCase() === email)) {
    if (seen.has(email)) {
      duplicates++;
      return;
    }
    seen.add(email);
    const values: Record<string, string> = {};
    if (header) {
      header.forEach((name, i) => {
        if (i !== headerEmailIdx && name) values[name] = cells[i] ?? "";
      });
    } else {
      const rest = cells.filter((_, i) => i !== emailIdx);
      variableNames.forEach((name, i) => (values[name] = rest[i] ?? ""));
    }
    rows.push({ email, values });
  }

  return { rows, invalid, duplicates, header };
}

/** Rows back into pasteable text with a header row, e.g. to keep failed sends for a retry. */
export function toSheet(rows: Row[], variableNames: string[]) {
  if (rows.length === 0) return "";
  return [["email", ...variableNames], ...rows.map((row) => [row.email, ...variableNames.map((n) => row.values[n] ?? "")])]
    .map((cells) => cells.join("\t"))
    .join("\n");
}
