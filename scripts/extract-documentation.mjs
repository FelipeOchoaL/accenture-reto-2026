import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, extname, join, relative, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import XLSX from "xlsx";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const inputDirectory = resolve(projectRoot, "documentation");
const outputFile = resolve(projectRoot, "data/documentation.json");

const DATE_COLUMNS = new Set([
  "fecha",
  "date",
  "hora",
  "hora_solicitud",
  "hora_atencion",
  "created_at",
  "updated_at",
]);

function normalizeHeader(header, index) {
  const normalized = String(header ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");

  return normalized || `column_${index + 1}`;
}

function normalizeCell(value, header) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value === "number" && DATE_COLUMNS.has(header)) {
    const format = header.startsWith("hora") && value >= 0 && value < 1
      ? "HH:mm:ss"
      : "yyyy-mm-dd HH:mm:ss";
    return XLSX.SSF.format(format, value);
  }

  return value;
}

function sheetToData(worksheet) {
  const matrix = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: null,
    raw: true,
  });

  if (matrix.length === 0) {
    return { headers: [], records: [] };
  }

  const headers = matrix[0].map(normalizeHeader);
  const records = matrix
    .slice(1)
    .filter((row) => row.some((value) => value !== null && value !== ""))
    .map((row) =>
      Object.fromEntries(
        headers.map((header, index) => [
          header,
          normalizeCell(row[index] ?? null, header),
        ]),
      ),
    );

  return { headers, records };
}

async function getWorkbookFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getWorkbookFiles(entryPath)));
    } else if ([".xlsx", ".xls", ".xlsm"].includes(extname(entry.name).toLowerCase())) {
      files.push(entryPath);
    }
  }

  return files.sort();
}

async function extractWorkbook(filePath) {
  const workbook = XLSX.read(await readFile(filePath), {
    type: "buffer",
    cellDates: false,
  });

  const sheets = Object.fromEntries(
    workbook.SheetNames.map((sheetName) => [
      sheetName,
      sheetToData(workbook.Sheets[sheetName]),
    ]),
  );

  return {
    file: relative(projectRoot, filePath),
    name: basename(filePath, extname(filePath)),
    sheets,
  };
}

function createSummary(workbooks) {
  const summary = {
    files: workbooks.length,
    sheets: 0,
    records: 0,
    byStatus: {},
  };

  for (const workbook of workbooks) {
    for (const sheet of Object.values(workbook.sheets)) {
      summary.sheets += 1;
      summary.records += sheet.records.length;

      for (const record of sheet.records) {
        const status = record.estado;
        if (typeof status === "string" && status.length > 0) {
          summary.byStatus[status] = (summary.byStatus[status] ?? 0) + 1;
        }
      }
    }
  }

  return summary;
}

async function main() {
  const files = await getWorkbookFiles(inputDirectory);
  const workbooks = await Promise.all(files.map(extractWorkbook));
  const result = {
    extractedAt: new Date().toISOString(),
    sourceDirectory: relative(projectRoot, inputDirectory),
    summary: createSummary(workbooks),
    workbooks,
  };

  await mkdir(dirname(outputFile), { recursive: true });
  await writeFile(outputFile, `${JSON.stringify(result, null, 2)}\n`, "utf8");

  console.log(
    `Extraídos ${result.summary.records} registros de ${result.summary.files} archivo(s) en ${relative(projectRoot, outputFile)}.`,
  );
}

main().catch((error) => {
  console.error("No se pudo extraer la documentación:", error);
  process.exitCode = 1;
});
