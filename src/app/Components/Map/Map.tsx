import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

interface Place {
  id?: string;
  name: string;
  position: [number, number];
  description?: string;
  category?: string;
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
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapEvents onMapClick={onMapClick} />

      {places.map((place, index) => (
        <Marker
          key={place.id || index}
          position={place.position}
          eventHandlers={{
            click: () => onMarkerClick(place),
          }}
        />
      ))}
    </MapContainer>
  );
};

export default Map;
