import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Stethoscope,
  Users,
  ChevronRight,
  AlertTriangle,
  Activity,
  UserPlus,
  Loader2,
  Wind,
  CheckCircle,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "../lib/trpc";
import { formatDate, scoreColor, oxygenColor, cn } from "../lib/utils";

type View = "patients" | "patient-detail";

function AssignPatientModal({ onClose }: { onClose: () => void }) {
  const [patientEmail, setPatientEmail] = useState("");
  const utils = trpc.useUtils();
  const assign = trpc.doctor.assignPatient.useMutation({
    onSuccess: () => {
      toast.success("Patient assigned successfully");
      utils.doctor.myPatients.invalidate();
      onClose();
    },
    onError: e => toast.error(e.message),
  });

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white">Assign Patient</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-gray-400">
          Enter the patient's email address to link them to your panel.
        </p>
        <input
          type="email"
          value={patientEmail}
          onChange={e => setPatientEmail(e.target.value)}
          placeholder="Patient Email"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
        />
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 text-sm text-gray-400 bg-gray-800 hover:bg-gray-700 py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => assign.mutate({ patientEmail })}
            disabled={!patientEmail || assign.isPending}
            className="flex-1 text-sm font-medium bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-950 py-2 rounded-lg transition-colors"
          >
            {assign.isPending ? "Assigning…" : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
}

function PatientScans({ patientId }: { patientId: number }) {
  const { data: scans, isLoading } = trpc.doctor.patientScans.useQuery({
    patientId,
  });

  if (isLoading)
    return (
      <div className="py-8 flex justify-center">
        <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
      </div>
    );
  if (!scans?.length)
    return (
      <div className="py-10 text-center">
        <Wind className="w-8 h-8 text-gray-700 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">No scans recorded yet</p>
      </div>
    );

  return (
    <div className="divide-y divide-gray-800">
      {scans.map(scan => (
        <div
          key={scan.id}
          className="flex items-center justify-between px-5 py-3.5"
        >
          <div className="flex items-center gap-3">
            {scan.status === "done" ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : scan.status === "error" ? (
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
            ) : (
              <Loader2 className="w-4 h-4 text-yellow-400 animate-spin flex-shrink-0" />
            )}
            <div>
              <p className="text-sm text-white">
                {formatDate(scan.recordedAt)}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {scan.patternType?.replace("_", " ") ?? "Pending analysis"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            {scan.oxygenEstimate != null && (
              <span
                className={cn("font-medium", oxygenColor(scan.oxygenEstimate))}
              >
                {scan.oxygenEstimate.toFixed(1)}% SpO₂
              </span>
            )}
            {scan.breathingRate != null && (
              <span className="text-gray-400">
                {scan.breathingRate.toFixed(0)} bpm
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function PatientAlerts({ patientId }: { patientId: number }) {
  const { data: alerts, isLoading } = trpc.doctor.patientAlerts.useQuery({
    patientId,
  });

  if (isLoading)
    return (
      <div className="py-8 flex justify-center">
        <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
      </div>
    );
  if (!alerts?.length)
    return (
      <div className="py-10 text-center">
        <p className="text-gray-500 text-sm">No alerts for this patient</p>
      </div>
    );

  return (
    <div className="divide-y divide-gray-800">
      {alerts.map(alert => (
        <div key={alert.id} className="px-5 py-4">
          <div className="flex items-start gap-3">
            <AlertTriangle
              className={cn(
                "w-4 h-4 mt-0.5 flex-shrink-0",
                alert.severity === "critical"
                  ? "text-red-400"
                  : alert.severity === "warning"
                    ? "text-yellow-400"
                    : "text-blue-400"
              )}
            />
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-medium text-white">{alert.title}</p>
                <span
                  className={cn(
                    "px-2 py-0.5 text-xs rounded-full capitalize",
                    alert.severity === "critical"
                      ? "bg-red-500/15 text-red-400"
                      : alert.severity === "warning"
                        ? "bg-yellow-500/15 text-yellow-400"
                        : "bg-blue-500/15 text-blue-400"
                  )}
                >
                  {alert.severity}
                </span>
              </div>
              <p className="text-xs text-gray-400">{alert.message}</p>
              <p className="text-xs text-gray-600 mt-1">
                {formatDate(alert.createdAt)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DoctorPanel() {
  const [view, setView] = useState<View>("patients");
  const [selectedPatient, setSelectedPatient] = useState<{
    id: number;
    name: string | null;
    email: string | null;
  } | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"scans" | "alerts">("scans");

  const { data: user } = trpc.auth.me.useQuery();
  const { data: patients, isLoading } = trpc.doctor.myPatients.useQuery();

  const isDoctor = user?.role === "doctor" || user?.role === "admin";

  if (!isDoctor) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <Stethoscope className="w-12 h-12 text-gray-700 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-white mb-2">
            Doctor Access Required
          </h2>
          <p className="text-gray-400 text-sm">
            This panel is only available to users with the{" "}
            <span className="text-cyan-400">doctor</span> or{" "}
            <span className="text-cyan-400">admin</span> role. Contact your
            administrator to request access.
          </p>
        </div>
      </div>
    );
  }

  if (view === "patient-detail" && selectedPatient) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setView("patients");
              setSelectedPatient(null);
            }}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {selectedPatient.name ?? "Unnamed Patient"}
            </h1>
            <p className="text-gray-400 text-sm">
              {selectedPatient.email ?? `User ID: ${selectedPatient.id}`}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 w-fit">
          {(["scans", "alerts"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors",
                activeTab === tab
                  ? "bg-cyan-500/15 text-cyan-400"
                  : "text-gray-400 hover:text-white"
              )}
            >
              {tab === "scans" ? (
                <span className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Scans
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Alerts
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          {activeTab === "scans" ? (
            <PatientScans patientId={selectedPatient.id} />
          ) : (
            <PatientAlerts patientId={selectedPatient.id} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {showAssignModal && (
        <AssignPatientModal onClose={() => setShowAssignModal(false)} />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Doctor Panel</h1>
          <p className="text-gray-400 mt-1">Manage and monitor your patients</p>
        </div>
        <button
          onClick={() => setShowAssignModal(true)}
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Assign Patient
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-800">
          <Users className="w-4 h-4 text-gray-500" />
          <h2 className="font-semibold text-white">My Patients</h2>
          <span className="ml-auto text-sm text-gray-500">
            {patients?.length ?? 0} patient{patients?.length !== 1 ? "s" : ""}
          </span>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
          </div>
        )}

        {!isLoading && (!patients || patients.length === 0) && (
          <div className="py-16 text-center">
            <Users className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-400">No patients assigned yet</p>
            <button
              onClick={() => setShowAssignModal(true)}
              className="mt-2 text-cyan-400 hover:underline text-sm"
            >
              Assign your first patient
            </button>
          </div>
        )}

        <div className="divide-y divide-gray-800">
          {patients?.map(patient => (
            <button
              key={patient.id}
              onClick={() => {
                setSelectedPatient(patient);
                setView("patient-detail");
                setActiveTab("scans");
              }}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-800/50 transition-colors group text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-cyan-500/10 flex items-center justify-center text-sm font-bold text-cyan-400">
                  {patient.name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {patient.name ?? "Unnamed Patient"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {patient.email ?? `ID: ${patient.id}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">
                  Since {formatDate(patient.assignedAt)}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
