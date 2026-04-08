// HL7 FHIR R4 type definitions and adapters for Chilean healthcare interoperability

export interface FhirPatient {
  rut: string | null;
  name: string;
  birth_date: string | null;
  sex: string | null;
  external_id: string | null;
  service_unit?: string | null;
  bed_number?: string | null;
  admission_date?: string | null;
  primary_diagnosis?: string | null;
}

export interface FhirExportPayload {
  patient_fhir_id?: string;
  exam_date: string;
  interpretation: string;
  findings: any[];
  practitioner_name: string;
  practitioner_rut?: string;
  sis_record?: string;
  pdf_url?: string;
}

export interface SyncLogEntry {
  id: string;
  action: string;
  direction: string;
  status: string;
  resource_type: string | null;
  error_message: string | null;
  created_at: string;
  connection_id: string;
  patient_id: string | null;
}

export interface InstitutionalConnection {
  id: string;
  institution_name: string;
  system_type: string;
  base_url: string | null;
  auth_method: string;
  connection_status: string;
  is_active: boolean;
  metadata: Record<string, any>;
  last_sync_at: string | null;
  created_at: string;
}

export const SYSTEM_TYPES = [
  { value: "fhir_r4", label: "HL7 FHIR R4" },
  { value: "rest_api", label: "API REST genérica" },
  { value: "manual", label: "Carga manual (CSV/JSON)" },
] as const;

export const AUTH_METHODS = [
  { value: "bearer_token", label: "Token Bearer" },
  { value: "basic", label: "Autenticación Básica" },
  { value: "api_key", label: "API Key" },
  { value: "none", label: "Sin autenticación" },
] as const;

export const CONNECTION_STATUSES: Record<
  string,
  { label: string; color: string }
> = {
  conectado: { label: "Conectado", color: "bg-green-500" },
  error: { label: "Error", color: "bg-red-500" },
  pendiente: { label: "Pendiente", color: "bg-yellow-500" },
  sin_url: { label: "Manual", color: "bg-blue-500" },
};

/** Map imported FHIR patient data to app's patient schema */
export function mapFhirToPatient(fhir: FhirPatient, userId: string) {
  return {
    name: fhir.name,
    rut: fhir.rut,
    sex: fhir.sex,
    external_id: fhir.external_id,
    admission_date: fhir.admission_date || null,
    primary_diagnosis: fhir.primary_diagnosis || null,
    service_unit: fhir.service_unit || null,
    bed_number: fhir.bed_number || null,
    user_id: userId,
  };
}

/** Parse CSV text to patient records */
export function parseCsvPatients(csvText: string): FhirPatient[] {
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
  const patients: FhirPatient[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map(v => v.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] || "";
    });

    patients.push({
      rut: row.rut || null,
      name: row.nombre || row.name || "Sin nombre",
      birth_date: row.fecha_nacimiento || row.birth_date || null,
      sex: row.sexo || row.sex || null,
      external_id: row.id_externo || row.external_id || null,
      service_unit: row.servicio || row.service_unit || null,
      bed_number: row.cama || row.bed_number || null,
      admission_date: row.fecha_ingreso || row.admission_date || null,
      primary_diagnosis: row.diagnostico || row.diagnosis || null,
    });
  }

  return patients;
}

/** Parse JSON array to patient records */
export function parseJsonPatients(jsonText: string): FhirPatient[] {
  try {
    const data = JSON.parse(jsonText);
    const arr = Array.isArray(data) ? data : data.patients || data.data || [];
    return arr.map((p: any) => ({
      rut: p.rut || null,
      name: p.nombre || p.name || "Sin nombre",
      birth_date: p.fecha_nacimiento || p.birth_date || null,
      sex: p.sexo || p.sex || null,
      external_id: p.id_externo || p.external_id || null,
      service_unit: p.servicio || p.service_unit || null,
      bed_number: p.cama || p.bed_number || null,
      admission_date: p.fecha_ingreso || p.admission_date || null,
      primary_diagnosis: p.diagnostico || p.diagnosis || null,
    }));
  } catch {
    return [];
  }
}
