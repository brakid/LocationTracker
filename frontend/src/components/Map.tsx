import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { LocationData } from '../types/socket';

interface MapProps {
  locations: LocationData[];
  currentUserId?: string;
}

const MapComponent: React.FC<MapProps> = ({ locations, currentUserId }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([40.7128, -74.0060], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    markersRef.current.forEach((marker) => {
      mapInstanceRef.current!.removeLayer(marker);
    });
    markersRef.current.clear();

    locations.forEach((location) => {
      const isCurrentUser = location.id === currentUserId;
      const markerColor = isCurrentUser ? 'blue' : 'red';
      
      const marker = L.marker([location.latitude, location.longitude], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: `<div style="background-color: ${markerColor}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        })
      });

      marker.bindPopup(`
        <div>
          <strong>${location.name || `User ${location.id}`}</strong><br/>
          Lat: ${location.latitude.toFixed(6)}<br/>
          Lng: ${location.longitude.toFixed(6)}<br/>
          Accuracy: ${location.accuracy.toFixed(0)}m<br/>
          ${isCurrentUser ? '<em>Your location</em>' : ''}
        </div>
      `);

      marker.addTo(mapInstanceRef.current!);
      markersRef.current.set(location.id, marker);
    });

    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map(loc => [loc.latitude, loc.longitude]));
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [locations, currentUserId]);

  return (
    <div 
      ref={mapRef} 
      style={{ height: '100%', width: '100%' }}
    />
  );
};

export default MapComponent;