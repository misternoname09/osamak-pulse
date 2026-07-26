import { useEffect, useRef, useState } from "react";
import osamakLogo from "@/assets/osamak-logo.jpeg.asset.json";
import { getCntsCenters, type CntsCenter } from "@/lib/cnts.functions";

type Center = CntsCenter;


export function BloodCentersMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const LRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const [centers, setCenters] = useState<Center[] | null>(null);
  const [dataError, setDataError] = useState<string | null>(null);
  const [source, setSource] = useState<"cnts" | "fallback" | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  const loadCenters = async () => {
    setLoadingData(true);
    setDataError(null);
    try {
      const res = await getCntsCenters();
      setCenters(res.centers);
      setSource(res.source);
      setUpdatedAt(res.updatedAt);
      if (res.error) setDataError(res.error);
    } catch (err) {
      setDataError(err instanceof Error ? err.message : "Erreur lors du chargement des centres CNTS.");
      setCenters([]);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadCenters();
  }, []);


  const locateMe = () => {
    setLocError(null);
    if (!navigator.geolocation) {
      setLocError("Géolocalisation non supportée par ce navigateur.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const L = LRef.current;
        const map = mapInstance.current;
        if (!L || !map) return;
        const { latitude, longitude } = pos.coords;
        if (userMarkerRef.current) {
          userMarkerRef.current.remove();
        }
        userMarkerRef.current = L.circleMarker([latitude, longitude], {
          radius: 9,
          color: "#1565C0",
          fillColor: "#1565C0",
          fillOpacity: 0.7,
          weight: 3,
        })
          .addTo(map)
          .bindPopup("Vous êtes ici");
        map.setView([latitude, longitude], 13);
      },
      (err) => {
        setLocating(false);
        setLocError(err.message || "Impossible d'obtenir votre position.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;
    if (!centers) return;


    let isMounted = true;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      LRef.current = L;

      if (!isMounted) return;

      // Fix for default leaflet icon issues in React
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const html = `
        <div style="position: relative; width: 44px; height: 54px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.35));">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 30" width="44" height="54" style="position:absolute; inset:0;">
            <path d="M12 1 C 12 8, 22 13, 22 21 A 10 10 0 0 1 2 21 C 2 13, 12 8, 12 1 Z"
                  fill="#E53935" stroke="#ffffff" stroke-width="1.5"/>
          </svg>
          <img src="${osamakLogo.url}" alt="OSAMAK"
               style="position:absolute; top:8px; left:50%; transform:translateX(-50%); width:26px; height:26px; border-radius:50%; object-fit:cover; border:2px solid #ffffff; background:#ffffff;" />
        </div>
      `;

      const bloodIcon = L.divIcon({
        className: "custom-blood-marker bg-transparent border-none",
        html,
        iconSize: [44, 54],
        iconAnchor: [22, 54],
        popupAnchor: [0, -50],
      });

      // Ensure we don't initialize map multiple times
      if (mapInstance.current) {
        mapInstance.current.remove();
      }

      // Initialize map
      const map = L.map(mapRef.current!, {
        center: [14.694, -17.447], // Dakar center
        zoom: 12,
        scrollWheelZoom: false,
      });
      mapInstance.current = map;

      // Add TileLayer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Add Markers
      CENTERS.forEach((center) => {
        const marker = L.marker([center.lat, center.lng], {
          icon: bloodIcon,
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

      // Fix size for dynamically loaded containers
      setTimeout(() => {
        if (isMounted) map.invalidateSize();
      }, 100);
      
      setTimeout(() => {
        if (isMounted) map.invalidateSize();
      }, 500);
    };

    initMap();

    // Cleanup function
    return () => {
      isMounted = false;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="my-10">
      <div className="flex flex-wrap gap-2 mb-3">
        <button
          onClick={locateMe}
          disabled={locating}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-accent text-accent-foreground hover:opacity-90 transition disabled:opacity-60"
        >
          {locating ? "⏳ Localisation..." : "📍 Me localiser"}
        </button>
        <a
          href="tel:+221338691818"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition"
        >
          📞 Appeler CNTS Dakar
        </a>
        <a
          href="https://www.google.com/maps/dir/?api=1&destination=14.728186,-17.443196"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border border-border bg-card hover:border-primary/50 transition"
        >
          🧭 Itinéraire vers CNTS
        </a>
      </div>
      {locError && (
        <p className="mb-3 text-sm text-destructive" role="alert">{locError}</p>
      )}
      <div className="w-full h-[500px] rounded-2xl overflow-hidden border border-border shadow-sm relative z-0">
        <div ref={mapRef} className="w-full h-full" />
      </div>
    </div>
  );
}
