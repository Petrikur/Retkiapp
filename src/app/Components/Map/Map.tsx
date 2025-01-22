import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  LayersControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Place } from "@/app/types";

// Set default marker icon to use a CDN
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapProps {
  places: Place[];
  onMapClick: (lat: number, lng: number) => void;
  onMarkerClick: (place: Place) => void;
}

function MapEvents({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

const Map = ({ places, onMapClick, onMarkerClick }: MapProps) => {
  return (
    <MapContainer
      center={[62.60118, 29.76316]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <LayersControl position="topright">
        {/* Base Layers */}
        <LayersControl.BaseLayer checked name="OpenStreetMap">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Satellite">
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
        </LayersControl.BaseLayer>
      </LayersControl>

      {/* Display markers directly on the map */}
      {places.map((place, index) => (
        <Marker
          key={place._id || index}
          position={place.position}
          eventHandlers={{
            click: () => onMarkerClick(place),
          }}
        />
      ))}

      <MapEvents onMapClick={onMapClick} />
    </MapContainer>
  );
};

export default Map;
