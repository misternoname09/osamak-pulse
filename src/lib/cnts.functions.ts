import { createServerFn } from "@tanstack/react-start";

export type CntsCenter = {
  name: string;
  lat: number;
  lng: number;
  status: "Disponible" | "Indisponible";
  delay?: string;
};

const FALLBACK: CntsCenter[] = [
  { name: "CNTS Dakar", lat: 14.728186, lng: -17.443196, status: "Disponible", delay: "2–3h" },
  { name: "Hôpital Principal Dakar", lat: 14.662557, lng: -17.435028, status: "Disponible", delay: "4h" },
  { name: "Hôpital Fann", lat: 14.693259, lng: -17.464911, status: "Disponible", delay: "3h" },
];

export type CntsResponse = {
  centers: CntsCenter[];
  source: "cnts" | "fallback";
  updatedAt: string;
  error?: string;
};

export const getCntsCenters = createServerFn({ method: "GET" }).handler(async (): Promise<CntsResponse> => {
  const url = process.env.CNTS_API_URL;
  if (!url) {
    return {
      centers: FALLBACK,
      source: "fallback",
      updatedAt: new Date().toISOString(),
      error: "API CNTS non configurée — données de démonstration affichées.",
    };
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: process.env.CNTS_API_KEY ? { Authorization: `Bearer ${process.env.CNTS_API_KEY}` } : undefined,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`CNTS ${res.status}`);
    const raw = (await res.json()) as unknown;
    const list = Array.isArray(raw) ? raw : (raw as { centers?: unknown[] })?.centers;
    if (!Array.isArray(list)) throw new Error("Format CNTS inattendu");
    const centers: CntsCenter[] = [];
    for (const c of list) {
      const o = c as Record<string, unknown>;
      const lat = Number(o.lat ?? o.latitude);
      const lng = Number(o.lng ?? o.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
      const status: CntsCenter["status"] = o.status === "Indisponible" ? "Indisponible" : "Disponible";
      centers.push({
        name: String(o.name ?? o.center ?? "Centre CNTS"),
        lat,
        lng,
        status,
        delay: o.delay ? String(o.delay) : undefined,
      });
    }
    if (centers.length === 0) throw new Error("Aucun centre reçu");
    return { centers, source: "cnts", updatedAt: new Date().toISOString() };
  } catch (err) {
    return {
      centers: FALLBACK,
      source: "fallback",
      updatedAt: new Date().toISOString(),
      error: err instanceof Error ? err.message : "Erreur inconnue CNTS",
    };
  }
});
