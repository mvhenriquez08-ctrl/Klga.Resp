import { useState } from "react";
import { motion } from "framer-motion";
import { thoracicZones } from "@/data/radiology";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

const zonePositions: Record<string, { x: number; y: number }> = {
  "right-apex": { x: 30, y: 12 },
  "left-apex": { x: 70, y: 12 },
  "right-hilum": { x: 38, y: 35 },
  "left-hilum": { x: 62, y: 32 },
  "right-mid": { x: 25, y: 38 },
  "left-mid": { x: 75, y: 38 },
  "right-base": { x: 28, y: 65 },
  "left-base": { x: 72, y: 65 },
  mediastinum: { x: 50, y: 40 },
};

export default function RXThoracicMap() {
  const [selected, setSelected] = useState<string | null>(null);
  const zone = selected ? thoracicZones.find(z => z.id === selected) : null;

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
                <MapPin className="h-5 w-5 text-accent-foreground" />
              </div>
              <h1 className="font-display text-2xl font-bold text-primary-foreground">
                Mapa Torácico Radiográfico
              </h1>
            </div>
            <p className="text-sm text-primary-foreground/60">
              Selecciona una zona del tórax para explorar hallazgos normales y
              anormales en radiografía.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Interactive Map */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-display">
                Vista Frontal del Tórax
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full aspect-[3/4] bg-black rounded-lg border overflow-hidden">
                {/* Detailed anatomical thorax SVG */}
                <svg
                  viewBox="0 0 300 380"
                  className="w-full h-full"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Background */}
                  <rect width="300" height="380" fill="#0a0a0a" />

                  {/* Chest wall outline */}
                  <path
                    d="M150 25 C95 25 55 60 45 110 L35 260 C33 310 70 355 150 355 C230 355 267 310 265 260 L255 110 C245 60 205 25 150 25Z"
                    fill="#1a1a1a"
                    stroke="#444"
                    strokeWidth="2"
                  />

                  {/* RIGHT LUNG */}
                  <path
                    d="M148 45 C130 42 100 48 80 70 C62 90 50 120 48 160 C46 200 50 240 58 265 C66 285 82 300 105 302 C125 303 142 290 148 272 L148 45Z"
                    fill="#1e1e1e"
                    stroke="#555"
                    strokeWidth="1.5"
                  />
                  {/* Right lung lobes separation */}
                  <path
                    d="M80 155 C95 145 115 148 148 160"
                    stroke="#333"
                    strokeWidth="1"
                    strokeDasharray="3,2"
                  />
                  <path
                    d="M60 200 C80 188 110 190 148 195"
                    stroke="#333"
                    strokeWidth="1"
                    strokeDasharray="3,2"
                  />
                  {/* Right lung vessels */}
                  <line
                    x1="115"
                    y1="90"
                    x2="95"
                    y2="180"
                    stroke="#2a2a2a"
                    strokeWidth="2"
                  />
                  <line
                    x1="105"
                    y1="130"
                    x2="75"
                    y2="200"
                    stroke="#2a2a2a"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="125"
                    y1="110"
                    x2="110"
                    y2="240"
                    stroke="#2a2a2a"
                    strokeWidth="1.5"
                  />

                  {/* LEFT LUNG */}
                  <path
                    d="M152 45 C170 42 200 48 220 70 C238 90 250 120 252 160 C254 200 250 240 242 265 C234 285 218 300 195 302 C175 303 158 290 152 272 L152 45Z"
                    fill="#1e1e1e"
                    stroke="#555"
                    strokeWidth="1.5"
                  />
                  {/* Left lung lobe separation - cardiac notch */}
                  <path
                    d="M220 155 C205 145 185 148 152 160"
                    stroke="#333"
                    strokeWidth="1"
                    strokeDasharray="3,2"
                  />
                  {/* Left lung vessels */}
                  <line
                    x1="185"
                    y1="90"
                    x2="205"
                    y2="180"
                    stroke="#2a2a2a"
                    strokeWidth="2"
                  />
                  <line
                    x1="195"
                    y1="130"
                    x2="225"
                    y2="200"
                    stroke="#2a2a2a"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="175"
                    y1="110"
                    x2="190"
                    y2="240"
                    stroke="#2a2a2a"
                    strokeWidth="1.5"
                  />

                  {/* TRACHEA */}
                  <rect
                    x="143"
                    y="20"
                    width="14"
                    height="55"
                    rx="7"
                    fill="#111"
                    stroke="#555"
                    strokeWidth="1.2"
                  />
                  {/* Carina */}
                  <path
                    d="M143 72 C130 78 118 85 108 95"
                    stroke="#555"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M157 72 C170 78 182 85 192 95"
                    stroke="#555"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                  {/* HEART */}
                  <path
                    d="M150 145 C138 130 118 130 115 148 C112 165 125 185 150 205 C175 185 188 165 185 148 C182 130 162 130 150 145Z"
                    fill="#2a1a1a"
                    stroke="#8b2020"
                    strokeWidth="1.5"
                  />

                  {/* SPINE */}
                  <rect
                    x="146"
                    y="25"
                    width="8"
                    height="330"
                    rx="4"
                    fill="#0a0a0a"
                    stroke="#333"
                    strokeWidth="0.8"
                  />
                  {[80, 110, 140, 170, 200, 230, 260, 290].map((y, i) => (
                    <ellipse
                      key={i}
                      cx="150"
                      cy={y}
                      rx="6"
                      ry="5"
                      fill="#111"
                      stroke="#333"
                      strokeWidth="0.6"
                    />
                  ))}

                  {/* RIBS */}
                  {[65, 95, 125, 155, 185, 215, 245].map((y, i) => (
                    <g key={i}>
                      {/* Right ribs */}
                      <path
                        d={`M144 ${y} Q115 ${y - 12} 80 ${y - 5} Q55 ${y + 5} 50 ${y + 20}`}
                        stroke="#3a3a3a"
                        strokeWidth="2.5"
                        fill="none"
                        strokeLinecap="round"
                      />
                      {/* Left ribs */}
                      <path
                        d={`M156 ${y} Q185 ${y - 12} 220 ${y - 5} Q245 ${y + 5} 250 ${y + 20}`}
                        stroke="#3a3a3a"
                        strokeWidth="2.5"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </g>
                  ))}

                  {/* CLAVICLES */}
                  <path
                    d="M150 35 C130 30 100 32 70 42"
                    stroke="#555"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M150 35 C170 30 200 32 230 42"
                    stroke="#555"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* DIAPHRAGM */}
                  <path
                    d="M48 270 Q100 295 150 292 Q200 295 252 270"
                    stroke="#555"
                    strokeWidth="2"
                    fill="none"
                  />

                  {/* HILUM markers */}
                  <circle
                    cx="110"
                    cy="130"
                    r="8"
                    fill="#1a2a1a"
                    stroke="#2a5a2a"
                    strokeWidth="1.2"
                  />
                  <circle
                    cx="190"
                    cy="128"
                    r="8"
                    fill="#1a2a1a"
                    stroke="#2a5a2a"
                    strokeWidth="1.2"
                  />

                  {/* Labels */}
                  <text
                    x="72"
                    y="100"
                    fontSize="8"
                    fill="#6b7280"
                    fontFamily="monospace"
                  >
                    PD
                  </text>
                  <text
                    x="215"
                    y="100"
                    fontSize="8"
                    fill="#6b7280"
                    fontFamily="monospace"
                  >
                    PI
                  </text>
                  <text
                    x="155"
                    y="18"
                    fontSize="7"
                    fill="#6b7280"
                    fontFamily="monospace"
                  >
                    TR
                  </text>
                  <text
                    x="134"
                    y="175"
                    fontSize="7"
                    fill="#6b7280"
                    fontFamily="monospace"
                  >
                    CX
                  </text>
                </svg>

                {/* Zone buttons */}
                {thoracicZones.map(z => {
                  const pos = zonePositions[z.id];
                  if (!pos) return null;
                  return (
                    <button
                      key={z.id}
                      onClick={() => setSelected(z.id)}
                      className={`absolute w-8 h-8 -ml-4 -mt-4 rounded-full flex items-center justify-center transition-all text-[9px] font-bold border ${
                        selected === z.id
                          ? "bg-primary text-primary-foreground scale-125 shadow-lg ring-2 ring-primary/30 border-primary"
                          : "bg-black/60 text-white border-white/30 hover:bg-primary/40 hover:scale-110"
                      }`}
                      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                      title={z.name}
                    >
                      {z.id.includes("apex")
                        ? "A"
                        : z.id.includes("mid")
                          ? "M"
                          : z.id.includes("base")
                            ? "B"
                            : z.id.includes("hilum")
                              ? "H"
                              : "Md"}
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 flex flex-wrap gap-1">
                {thoracicZones.map(z => (
                  <button
                    key={z.id}
                    onClick={() => setSelected(z.id)}
                    className={`text-[10px] px-2 py-1 rounded-md border transition-all ${
                      selected === z.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/50 text-muted-foreground border-border hover:border-primary/30"
                    }`}
                  >
                    {z.name}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Zone Detail */}
          <div>
            {zone ? (
              <Card>
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    {zone.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {zone.anatomicalLandmarks}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-success">
                      Hallazgos Normales
                    </h4>
                    <ul className="space-y-1">
                      {zone.normalFindings.map(f => (
                        <li
                          key={f}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <span className="text-success mt-0.5">✓</span> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-destructive">
                      Hallazgos Anormales
                    </h4>
                    <ul className="space-y-1">
                      {zone.abnormalFindings.map(f => (
                        <li
                          key={f}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <span className="text-destructive mt-0.5">✗</span> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground/20 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Selecciona una zona en el mapa o en las etiquetas para ver
                    los hallazgos
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
