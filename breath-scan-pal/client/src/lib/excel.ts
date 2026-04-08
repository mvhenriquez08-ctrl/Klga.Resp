import * as XLSX from "xlsx";

interface PatientExportRow {
  [key: string]: string | number | null;
}

const EXPORT_COLUMNS = [
  { key: "id", header: "ID Paciente" },
  { key: "name", header: "Nombre completo" },
  { key: "rut", header: "RUT / Documento" },
  { key: "initials", header: "Iniciales" },
  { key: "age", header: "Edad" },
  { key: "sex", header: "Sexo" },
  { key: "phone", header: "Teléfono" },
  { key: "email", header: "Correo electrónico" },
  { key: "address", header: "Dirección" },
  { key: "commune", header: "Comuna / Ciudad" },
  { key: "primary_diagnosis", header: "Diagnóstico principal" },
  { key: "responsible_professional", header: "Profesional asignado" },
  { key: "patient_status", header: "Estado del paciente" },
  { key: "icu_admission_date", header: "Fecha de ingreso" },
  { key: "service_unit", header: "Servicio / Unidad" },
  { key: "bed_number", header: "N° Cama" },
  { key: "establishment", header: "Establecimiento" },
  { key: "respiratory_support", header: "Soporte respiratorio" },
  { key: "clinical_notes", header: "Observaciones" },
];

const IMPORT_COLUMN_MAP: Record<string, string> = {
  "nombre completo": "name",
  nombre: "name",
  rut: "rut",
  "rut / documento": "rut",
  documento: "rut",
  iniciales: "initials",
  edad: "age",
  sexo: "sex",
  teléfono: "phone",
  telefono: "phone",
  "correo electrónico": "email",
  "correo electronico": "email",
  email: "email",
  dirección: "address",
  direccion: "address",
  "comuna / ciudad": "commune",
  comuna: "commune",
  ciudad: "commune",
  "diagnóstico principal": "primary_diagnosis",
  "diagnostico principal": "primary_diagnosis",
  diagnóstico: "primary_diagnosis",
  diagnostico: "primary_diagnosis",
  "profesional asignado": "responsible_professional",
  profesional: "responsible_professional",
  "estado del paciente": "patient_status",
  estado: "patient_status",
  "fecha de ingreso": "icu_admission_date",
  observaciones: "clinical_notes",
  notas: "clinical_notes",
  servicio: "service_unit",
  unidad: "service_unit",
  cama: "bed_number",
  establecimiento: "establishment",
  peso: "weight",
  talla: "height",
  previsión: "prevision",
  prevision: "prevision",
};

function cleanValue(val: unknown): string {
  if (val === null || val === undefined) return "";
  return String(val).trim();
}

function formatDate(date: string | Date | null): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
}

export function exportPatientsToExcel(patients: any[]): void {
  const rows: PatientExportRow[] = patients.map(p => {
    const row: PatientExportRow = {};
    EXPORT_COLUMNS.forEach(({ key, header }) => {
      let val = p[key];
      if (key === "icu_admission_date" || key === "created_at") {
        val = formatDate(val);
      }
      row[header] = val != null && val !== "" ? String(val) : "";
    });
    return row;
  });

  const ws = XLSX.utils.json_to_sheet(rows);

  // Column widths
  ws["!cols"] = EXPORT_COLUMNS.map(c => ({
    wch: Math.max(c.header.length + 2, 15),
  }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Pacientes");

  const today = new Date().toISOString().split("T")[0];
  XLSX.writeFile(wb, `pacientes_${today}.xlsx`);
}

export function downloadTemplate(): void {
  const headers = [
    "Nombre completo",
    "RUT / Documento",
    "Iniciales",
    "Edad",
    "Sexo",
    "Teléfono",
    "Correo electrónico",
    "Dirección",
    "Comuna / Ciudad",
    "Diagnóstico principal",
    "Profesional asignado",
    "Estado del paciente",
    "Fecha de ingreso",
    "Observaciones",
    "Peso",
    "Talla",
    "Previsión",
    "Servicio",
    "Cama",
    "Establecimiento",
  ];

  const exampleRow = [
    "Juan Pérez",
    "12.345.678-9",
    "JPL",
    "65",
    "Masculino",
    "+56912345678",
    "jpere@email.com",
    "Av. Libertador 123",
    "Santiago",
    "Neumonía",
    "Dr. García",
    "Activo",
    "15-03-2026",
    "Paciente en UCI",
    "75",
    "170",
    "Fonasa",
    "UCI Adultos",
    "12",
    "Hospital Base",
  ];

  const ws = XLSX.utils.aoa_to_sheet([headers, exampleRow]);
  ws["!cols"] = headers.map(h => ({ wch: Math.max(h.length + 2, 15) }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Plantilla");
  XLSX.writeFile(wb, "plantilla_pacientes.xlsx");
}

export interface ImportResult {
  valid: ImportRow[];
  errors: ImportError[];
  duplicates: ImportRow[];
}

export interface ImportRow {
  rowIndex: number;
  data: Record<string, string>;
}

export interface ImportError {
  rowIndex: number;
  field: string;
  message: string;
  data: Record<string, string>;
}

export function parseExcelFile(file: File): Promise<ImportResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, {
          defval: "",
        });

        const valid: ImportRow[] = [];
        const errors: ImportError[] = [];
        const duplicates: ImportRow[] = [];
        const seenRuts = new Set<string>();

        rawRows.forEach((raw, idx) => {
          const mapped: Record<string, string> = {};

          Object.entries(raw).forEach(([header, value]) => {
            const normalizedHeader = header.toLowerCase().trim();
            const fieldKey = IMPORT_COLUMN_MAP[normalizedHeader];
            if (fieldKey) {
              mapped[fieldKey] = cleanValue(value);
            }
          });

          const rowIndex = idx + 2; // Excel row (header = 1)
          const rowErrors: ImportError[] = [];

          // Required: name
          if (!mapped.name && !mapped.initials) {
            rowErrors.push({
              rowIndex,
              field: "name",
              message: "Nombre o iniciales requerido",
              data: mapped,
            });
          }

          // Validate email format
          if (
            mapped.email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mapped.email)
          ) {
            rowErrors.push({
              rowIndex,
              field: "email",
              message: "Formato de email inválido",
              data: mapped,
            });
          }

          // Duplicate RUT check
          if (mapped.rut) {
            const cleanRut = mapped.rut.replace(/[.\-]/g, "").toUpperCase();
            if (seenRuts.has(cleanRut)) {
              duplicates.push({ rowIndex, data: mapped });
              return;
            }
            seenRuts.add(cleanRut);
          }

          if (rowErrors.length > 0) {
            errors.push(...rowErrors);
          } else {
            valid.push({ rowIndex, data: mapped });
          }
        });

        resolve({ valid, errors, duplicates });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Error leyendo archivo"));
    reader.readAsArrayBuffer(file);
  });
}
