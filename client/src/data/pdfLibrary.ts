export interface rx_pdf_item {
  id: string;
  title: string;
  url: string;
  description: string;
  category: "guia" | "patologico" | "referencia";
}

export const rxPdfItems: rx_pdf_item[] = [
  {
    id: "guia-general",
    title: "RX Tórax - Guía General",
    url: "/rx_torax/Rx_torax.pdf",
    description:
      "Manual completo de radiografía de tórax, anatomía y técnica básica.",
    category: "guia",
  },
  {
    id: "patologica",
    title: "RX Tórax Patológica",
    url: "/rx_torax/rxtx_patologica.pdf",
    description:
      "Atlas de hallazgos patológicos comunes y críticos en radiografía de tórax.",
    category: "patologico",
  },
  {
    id: "bases-170",
    title: "Regreso a las Bases - 170",
    url: "/rx_torax/170-Regreso-a-las-bases.pdf",
    description:
      "Revisión fundamental de los principios de interpretación radiográfica.",
    category: "referencia",
  },
  {
    id: "copia-referencia",
    title: "RX Tórax - Copia de Referencia",
    url: "/rx_torax/Copia de Rx_torax.pdf",
    description:
      "Material de consulta rápida para comparación y referencia técnica.",
    category: "referencia",
  },
];
