import { useEffect, useState } from "react";
import { useListLocations, getListLocationsQueryKey } from "@workspace/api-client-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Link } from "wouter";
import { Loader2, HomeIcon, MapPinIcon } from "lucide-react";
import L from "leaflet";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Component to handle fitting bounds to all markers
function MapBounds({ markers }: { markers: Array<{lat: number, lng: number}> }) {
  const map = useMap();
  
  useEffect(() => {
    if (markers && markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    }
  }, [map, markers]);
  
  return null;
}

export function MapPage() {
  const { data: locations, isLoading } = useListLocations({
    query: { queryKey: getListLocationsQueryKey() }
  });

  // Default center (Bangalore approx) if no locations
  const defaultCenter: [number, number] = [12.9716, 77.5946];
  
  const markerPositions = locations?.map(loc => ({ lat: loc.latitude, lng: loc.longitude })) || [];

  return (
    <div className="relative w-full" style={{ height: "calc(100vh - 4rem)" }}>
      <div className="absolute top-4 left-4 z-[400] bg-background/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-border/50 max-w-[300px]">
        <h1 className="text-xl font-serif font-bold mb-1 flex items-center gap-2">
          <MapPinIcon className="h-5 w-5 text-accent" />
          Campus Map
        </h1>
        <p className="text-xs text-muted-foreground mb-3">
          Find accommodations around the campus area.
        </p>
        <div className="flex items-center justify-between text-sm font-medium border-t border-border/40 pt-2">
          <span>Total PGs</span>
          <Badge variant="secondary" className="bg-accent/20 text-accent-foreground border-accent/20">
            {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : locations?.length || 0}
          </Badge>
        </div>
      </div>

      <div className="absolute inset-0 z-0 bg-muted/20">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center z-[400] bg-background/50 backdrop-blur-sm">
            <Loader2 className="h-10 w-10 animate-spin text-accent" />
          </div>
        ) : null}
        
        <MapContainer 
          center={defaultCenter} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          
          <MapBounds markers={markerPositions} />
          
          {locations?.map((loc) => (
            <Marker key={loc.id} position={[loc.latitude, loc.longitude]}>
              <Popup className="custom-popup">
                <Card className="w-64 border-0 shadow-none bg-transparent">
                  {loc.imageUrl && (
                    <div className="w-full h-24 mb-2 rounded-md overflow-hidden relative">
                      <img src={loc.imageUrl} alt={loc.name} className="w-full h-full object-cover" />
                      <div className="absolute top-1 right-1 bg-background/90 px-2 py-0.5 rounded text-xs font-bold text-primary">
                        ${loc.monthlyRent}
                      </div>
                    </div>
                  )}
                  <CardContent className="p-0 pt-1">
                    <h3 className="font-bold text-base leading-tight mb-1 truncate">{loc.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{loc.address}</p>
                    
                    {!loc.imageUrl && (
                      <p className="text-sm font-bold text-primary mb-3">${loc.monthlyRent}/mo</p>
                    )}
                    
                    <Link href={`/pgs/${loc.id}`} className="block w-full text-center bg-secondary hover:bg-secondary/90 text-secondary-foreground text-xs font-medium py-2 rounded-md transition-colors">
                      View Details
                    </Link>
                  </CardContent>
                </Card>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <style>{`
        /* Custom Leaflet overrides */
        .leaflet-container {
          font-family: var(--app-font-sans);
        }
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: var(--radius-lg);
          padding: 0.5rem;
          box-shadow: var(--shadow-lg);
          border: 1px solid hsl(var(--border) / 0.5);
        }
        .custom-popup .leaflet-popup-content {
          margin: 0;
        }
        .custom-popup .leaflet-popup-tip {
          box-shadow: var(--shadow-lg);
          border: 1px solid hsl(var(--border) / 0.5);
        }
      `}</style>
    </div>
  );
}
