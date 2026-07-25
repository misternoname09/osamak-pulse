import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

if (typeof window !== "undefined") {
  // Fix for default leaflet icon issues in React
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

const createCustomIcon = () => {
  if (typeof window === "undefined") return null;
  
  // Using raw HTML/SVG to avoid react-dom/server rendering issues on the client
  const html = `
    <div style="color: hsl(var(--primary)); filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.4))">
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="currentColor" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>
      </svg>
    </div>
  `;

  return L.divIcon({
    className: "custom-blood-marker bg-transparent border-none",
    html,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

const bloodIcon = typeof window !== "undefined" ? createCustomIcon() : null;

type Center = {
  name: string;
  lat: number;
  lng: number;
  status: "Disponible" | "Indisponible";
  delay?: string;
};

const CENTERS: Center[] = [
  { name: "CNTS Dakar", lat: 14.728186, lng: -17.443196, status: "Disponible", delay: "2–3h" },
  { name: "Hôpital Principal Dakar", lat: 14.662557, lng: -17.435028, status: "Disponible", delay: "4h" },
  { name: "Hôpital Fann", lat: 14.693259, lng: -17.464911, status: "Disponible", delay: "3h" },
];

export function BloodCentersMap() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current, {
      center: [14.694, -17.447], // Dakar center
      zoom: 12,
      scrollWheelZoom: false,
    });

    // Add TileLayer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add Markers
    CENTERS.forEach((center) => {
      const marker = L.marker([center.lat, center.lng], {
        icon: bloodIcon as L.DivIcon,
      }).addTo(map);

      // Create popup content
      const statusClass =
        center.status === "Disponible"
          ? "bg-success/15 text-success"
          : "bg-destructive/10 text-destructive";
      const dotClass =
        center.status === "Disponible" ? "bg-success" : "bg-destructive";

      let popupHtml = `
        <div class="p-1 min-w-[200px] font-sans">
          <h3 class="font-semibold text-base mb-2">${center.name}</h3>
          <div class="flex flex-col gap-2 text-sm">
            <div class="flex items-center justify-between gap-4">
              <span class="text-muted-foreground">Statut</span>
              <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${statusClass}">
                <span class="w-1.5 h-1.5 rounded-full ${dotClass}"></span>
                ${center.status}
              </span>
            </div>
      `;

      if (center.delay) {
        popupHtml += `
            <div class="flex items-center justify-between gap-4">
              <span class="text-muted-foreground">Délai</span>
              <span class="font-medium">${center.delay}</span>
            </div>
        `;
      }

      popupHtml += `
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { className: "rounded-xl" });
    });

    // Cleanup function
    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="w-full h-[500px] rounded-2xl overflow-hidden border border-border shadow-sm my-10 relative z-0">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
