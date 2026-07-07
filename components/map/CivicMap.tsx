"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "./MarkerClusterGroup";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { CivicService, CATEGORY_META } from "@/types";
import { MUMBAI_CENTER } from "@/data/markers";
import { Clock, MapPin, Phone, Sparkles } from "lucide-react";

function buildIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<div class="civic-marker" style="background:${color}"></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
}

function FitBoundsOnChange({ services, defaultCenter }: { services: CivicService[], defaultCenter: [number, number] }) {
  const map = useMap();
  
  useMemo(() => {
    if (services.length === 0) {
      map.setView(defaultCenter, 12);
      return;
    }
    
    if (services.length === 1) {
      map.setView([services[0].lat, services[0].lng], 14);
      return;
    }

    const bounds = L.latLngBounds(services.map(s => [s.lat, s.lng]));
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
  }, [services, map, defaultCenter]);

  return null;
}

interface CivicMapProps {
  services: CivicService[];
  center?: [number, number];
  onAskAi: (service: CivicService) => void;
}

export default function CivicMap({
  services,
  center = MUMBAI_CENTER,
  onAskAi,
}: CivicMapProps) {
  const icons = useMemo(() => {
    const map = new Map<string, L.DivIcon>();
    Object.entries(CATEGORY_META).forEach(([key, meta]) => {
      map.set(key, buildIcon(meta.color));
    });
    return map;
  }, []);

  return (
    <MapContainer
      center={center}
      zoom={12}
      scrollWheelZoom
      className="h-full w-full"
    >
      <FitBoundsOnChange services={services} defaultCenter={center} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MarkerClusterGroup chunkedLoading maxClusterRadius={40}>
        {services.map((service) => (
          <Marker
            key={service.id}
            position={[service.lat, service.lng]}
            icon={icons.get(service.category)}
          >
            <Popup className="civic-popup">
              <div className="p-3 w-[260px] font-sans">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">
                    {service.category === 'hospital' || service.category === 'phc' || service.category === 'blood-bank' ? '🏥' :
                     service.category === 'police' ? '🚓' :
                     service.category === 'fire-station' ? '🚒' :
                     service.category === 'school' ? '🏫' :
                     '🏢'}
                  </span>
                  <h4 className="font-display text-base font-bold text-ink leading-tight">
                    {service.name}
                  </h4>
                </div>
                
                <div className="text-xs text-muted mb-1">
                  {CATEGORY_META[service.category].label}
                </div>
                
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex text-amber-400 text-xs">
                    {'★'.repeat(Math.round(service.rating || 0))}
                    {'☆'.repeat(5 - Math.round(service.rating || 0))}
                  </div>
                  <span className="text-[10px] text-muted ml-1">({service.rating || 0})</span>
                </div>

                <div className="inline-block rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-3">
                  Open
                </div>

                <div className="flex flex-col gap-1.5 text-xs text-ink mb-4">
                  <span className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 shrink-0 text-muted mt-0.5" />
                    <span className="leading-tight">{service.address}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4 shrink-0 text-muted" />
                    {service.openHours}
                  </span>
                  {service.phone && (
                    <span className="flex items-center gap-2">
                      <Phone className="h-4 w-4 shrink-0 text-muted" />
                      {service.phone}
                    </span>
                  )}
                </div>

                <div className="border-t border-border pt-3 flex flex-col gap-2">
                  <button
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg gradient-brand px-3 py-2 text-xs font-bold text-white hover:opacity-90 transition-opacity shadow-sm"
                    onClick={() => onAskAi(service)}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Ask AI
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-border bg-white px-2 py-2 text-xs font-bold text-ink hover:bg-background transition-colors"
                      onClick={() =>
                        window.open(
                          `https://www.google.com/maps/dir/?api=1&destination=${service.lat},${service.lng}`,
                          "_blank"
                        )
                      }
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      Directions
                    </button>
                    <button
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-border bg-white px-2 py-2 text-xs font-bold text-ink hover:bg-background transition-colors"
                    >
                      Nearby
                    </button>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
