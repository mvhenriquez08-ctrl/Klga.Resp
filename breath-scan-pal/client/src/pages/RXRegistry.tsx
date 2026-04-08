import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileImage,
  Save,
  Loader2,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import SignedImage from "@/components/ui/signed-image";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { uploadAndSign, getSignedStorageUrl } from "@/lib/storage";

const rxFindingsList = [
  "infiltrados",
  "consolidación",
  "derrame_pleural",
  "neumotórax",
  "cardiomegalia",
  "atelectasia",
  "edema_pulmonar",
  "masa",
  "adenopatía",
  "engrosamiento_pleural",
  "enfisema",
];

export default function RXRegistry() {
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [patientId, setPatientId] = useState("");
  const [xrayType, setXrayType] = useState("ap");
  const [quality, setQuality] = useState("");
  const [rotationVal, setRotationVal] = useState("");
  const [inspiration, setInspiration] = useState("");
  const [findingsMap, setFindingsMap] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: patients = [] } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patients")
        .select("id, name")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: records = [], isLoading } = useQuery({
    queryKey: ["xray-examinations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("xray_examinations")
        .select("*, patients(name)")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!patientId) throw new Error("Selecciona un paciente");

      let image_url: string | null = null;
      let storagePath: string | null = null;

      // Upload image if provided
      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        storagePath = `xray/${patientId}/${Date.now()}.${ext}`;
        const result = await uploadAndSign(
          "clinical-files",
          storagePath,
          imageFile
        );
        image_url = storagePath; // Store path, not URL
      }

      // Save xray_examination
      const { data: exam, error } = await supabase
        .from("xray_examinations")
        .insert({
          patient_id: patientId,
          xray_type: xrayType || null,
          technical_quality: quality || null,
          rotation: rotationVal || null,
          inspiration: inspiration || null,
          findings: findingsMap,
          notes: notes || null,
          image_url,
        })
        .select("id")
        .single();
      if (error) throw error;

      // Register in study_files if image was uploaded
      if (image_url && storagePath && exam) {
        await supabase.from("study_files").insert({
          patient_id: patientId,
          related_type: "xray_examination",
          related_id: exam.id,
          file_type: "xray_image",
          bucket_name: "clinical-files",
          file_path: storagePath,
          file_url: image_url,
          mime_type: imageFile!.type,
          original_filename: imageFile!.name,
        });
      }

      // Auto-create clinical_labels for positive findings
      const positiveFindings = Object.entries(findingsMap)
        .filter(([, v]) => v)
        .map(([k]) => k);
      if (positiveFindings.length > 0 && exam) {
        const labelRows = positiveFindings.map(f => ({
          patient_id: patientId,
          source_type: "xray",
          source_record_id: exam.id,
          label_category: "finding",
          label_name: f.replace(/_/g, " "),
          label_value: "present",
          validation_status: "draft",
        }));
        await supabase.from("clinical_labels").insert(labelRows);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["xray-examinations"] });
      toast.success("Registro radiográfico guardado con trazabilidad completa");
      setFindingsMap({});
      setNotes("");
      setQuality("");
      setRotationVal("");
      setInspiration("");
      setImageFile(null);
      setImagePreview(null);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="min-h-full">
      <div className="bg-gradient-hero px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                <FileImage className="h-5 w-5 text-accent-foreground" />
              </div>
              <h1 className="font-display text-2xl font-bold text-primary-foreground">
                Registro de Radiografía de Tórax
              </h1>
            </div>
            <p className="text-sm text-primary-foreground/60">
              Registra hallazgos radiográficos, sube imagen y genera
              trazabilidad automática.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-display">
                Nuevo Registro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs">Paciente</Label>
                <Select value={patientId} onValueChange={setPatientId}>
                  <SelectTrigger className="h-8 text-xs mt-1">
                    <SelectValue placeholder="Seleccionar paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map(p => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Image upload */}
              <div>
                <Label className="text-xs">Imagen Radiográfica</Label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <Button
                  variant="outline"
                  className="w-full mt-1 h-8 text-xs"
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload className="h-3.5 w-3.5 mr-2" />
                  {imageFile ? imageFile.name : "Subir radiografía"}
                </Button>
                {imagePreview && (
                  <div className="mt-2 rounded-lg border border-border overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-32 object-contain bg-muted"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Tipo de RX</Label>
                  <Select value={xrayType} onValueChange={setXrayType}>
                    <SelectTrigger className="h-8 text-xs mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ap">AP</SelectItem>
                      <SelectItem value="pa">PA</SelectItem>
                      <SelectItem value="lateral">Lateral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Calidad Técnica</Label>
                  <Select value={quality} onValueChange={setQuality}>
                    <SelectTrigger className="h-8 text-xs mt-1">
                      <SelectValue placeholder="Evaluar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="adecuada">Adecuada</SelectItem>
                      <SelectItem value="subóptima">Subóptima</SelectItem>
                      <SelectItem value="inadecuada">Inadecuada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Rotación</Label>
                  <Select value={rotationVal} onValueChange={setRotationVal}>
                    <SelectTrigger className="h-8 text-xs mt-1">
                      <SelectValue placeholder="Evaluar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sin_rotación">Sin rotación</SelectItem>
                      <SelectItem value="rotación_derecha">
                        Rotación derecha
                      </SelectItem>
                      <SelectItem value="rotación_izquierda">
                        Rotación izquierda
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Inspiración</Label>
                  <Select value={inspiration} onValueChange={setInspiration}>
                    <SelectTrigger className="h-8 text-xs mt-1">
                      <SelectValue placeholder="Evaluar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="adecuada">
                        Adecuada (≥6 arcos)
                      </SelectItem>
                      <SelectItem value="insuficiente">Insuficiente</SelectItem>
                      <SelectItem value="hiperinsuflación">
                        Hiperinsuflación
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold mb-2">Hallazgos</p>
                <div className="grid grid-cols-2 gap-2">
                  {rxFindingsList.map(f => (
                    <label
                      key={f}
                      className="flex items-center gap-2 text-xs cursor-pointer"
                    >
                      <Checkbox
                        checked={findingsMap[f] || false}
                        onCheckedChange={checked =>
                          setFindingsMap(prev => ({ ...prev, [f]: !!checked }))
                        }
                      />
                      {f.replace(/_/g, " ")}
                    </label>
                  ))}
                </div>
              </div>

              <Textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Notas y observaciones..."
                className="text-xs min-h-[60px]"
              />
              <Button
                onClick={() => saveMutation.mutate()}
                disabled={!patientId || saveMutation.isPending}
                className="w-full gap-2"
              >
                {saveMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Guardar Registro
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-display">
                Registros Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Cargando...</p>
              ) : records.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Sin registros aún
                </p>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-auto">
                  {records.map((r: any) => (
                    <div
                      key={r.id}
                      className="p-3 rounded-lg border text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">
                          {r.patients?.name || "—"}
                        </span>
                        <span className="text-muted-foreground">
                          {r.exam_date}
                        </span>
                      </div>
                      {r.image_url && (
                        <SignedImage
                          bucket="clinical-files"
                          path={r.image_url}
                          alt="RX"
                          className="w-full h-20 object-contain rounded bg-muted"
                        />
                      )}
                      <div className="flex flex-wrap gap-1">
                        {r.xray_type && (
                          <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                            {r.xray_type.toUpperCase()}
                          </span>
                        )}
                        {r.technical_quality && (
                          <span>{r.technical_quality}</span>
                        )}
                        {r.findings &&
                          Object.entries(r.findings as Record<string, boolean>)
                            .filter(([, v]) => v)
                            .map(([k]) => (
                              <span
                                key={k}
                                className="px-1.5 py-0.5 rounded bg-destructive/10 text-destructive"
                              >
                                {k.replace(/_/g, " ")}
                              </span>
                            ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
