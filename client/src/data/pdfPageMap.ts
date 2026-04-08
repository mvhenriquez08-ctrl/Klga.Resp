export const CT_PDF_URL =
  "https://www.neumologiaysalud.es/descargas/R11/R111-5.pdf";
export const RX_PDF_URL =
  "https://medfinis.cl/img/manuales/rxtx_patologica.pdf";

export const CT_PDF_PAGES: Record<string, number> = {
  normal: 2,
  "vidrio-deslustrado": 5,
  "consolidacion-tc": 4,
  enfisema: 7,
  "crazy-paving": 9,
  panalización: 10,
  bronquiectasias: 8,
  "nodulo-pulmonar": 6,
  "derrame-pleural-tc": 5,
  tep: 11,
};

export const RX_PDF_PAGES: Record<string, number> = {
  "normal-pa": 3,
  "normal-lateral": 4,
  "lobar-pneumonia": 22,
  "pleural-effusion-large": 45,
  "tension-pneumothorax": 55,
  "pulmonary-edema": 36,
  "atelectasis-rul": 42,
  "cardiomegaly-severe": 48,
  "ards-icu": 38,
  "mediastinal-widening": 52,
};
