import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Droplet } from "lucide-react";
import { renderToString } from "react-dom/server";

// Fix for default leaflet icon issues in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const createCustomIcon = () => {
  const html = renderToString(
    <div className="text-primary" style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.4))" }}>
      <Droplet size={36} className="fill-primary text-primary-foreground stroke-white stroke-[1.5]" />
    </div>
  );

  return L.divIcon({
    className: "custom-blood-marker bg-transparent border-none",
    html,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

const bloodIcon = createCustomIcon();

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
  const dakarCenter: [number, number] = [14.694, -17.447]; // Center to include all 3

  return (
    <div className="w-full h-[500px] rounded-2xl overflow-hidden border border-border shadow-sm my-10 relative z-0">
      <MapContainer center={dakarCenter} zoom={12} className="w-full h-full" scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {CENTERS.map((center, idx) => (
          <Marker key={idx} position={[center.lat, center.lng]} icon={bloodIcon}>
            <Popup className="rounded-xl">
              <div className="p-1">
                <h3 className="font-semibold text-base mb-2">{center.name}</h3>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Statut</span>
                    <span
                      className={
                        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold " +
                        (center.status === "Disponible"
                          ? "bg-success/15 text-success"
                          : "bg-destructive/10 text-destructive")
                      }
                    >
                      <span
                        className={
                          "w-1.5 h-1.5 rounded-full " +
                          (center.status === "Disponible" ? "bg-success" : "bg-destructive")
                        }
                      />
                      {center.status}
                    </span>
                  </div>
                  {center.delay && (
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">Délai</span>
                      <span className="font-medium">{center.delay}</span>
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
