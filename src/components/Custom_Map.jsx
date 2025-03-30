import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix marker issue in React-Leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 20],
  iconAnchor: [12, 41],
});

// Approximate bounding box for Maharashtra (used to restrict panning)
const maharashtraBounds = [
  [15.6, 72.6],  // Southwest corner (approx)
  [21.0, 80.0],  // Northeast corner (approx)
];

const CustomMap = () => {
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    // Replace with the correct path or URL for your Maharashtra GeoJSON file
    fetch("Maharashtra.geojson")
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error("Error loading GeoJSON:", err));
  }, []);

  // Custom style for the GeoJSON layer
  const geoStyle = {
    color: "red",      // Red border
    weight: 2,         // Border thickness
    fillOpacity: 0,    // No fill color so only the border is visible
  };

  return (
    <div className="map-wrapper">
      <MapContainer
        center={[19.7515, 75.7139]} // Maharashtra's approximate center
        zoom={7}
        minZoom={7}
        maxZoom={10}
        maxBounds={maharashtraBounds}
        maxBoundsViscosity={1.0}
        className="leaflet-container"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[18.5167, 73.85]} icon={customIcon}>
          <Popup>
            STATE : MAHARASHTRA <br /> DISTRICT : PUNE <br /> STATION : PASHAN_AWS_LAB
          </Popup>
        </Marker>
        <Marker position={[19.2092, 73.8725]} icon={customIcon}>
          <Popup>
            STATE : MAHARASHTRA <br /> DISTRICT : PUNE <br /> STATION : NIMGIRI_JUNNAR
          </Popup>
        </Marker>
        <Marker position={[18.5386,	73.842]} icon={customIcon}>
          <Popup>
            STATE : MAHARASHTRA <br /> DISTRICT : PUNE <br /> STATION : CAGMO_SHIVAJINAGAR
          </Popup>
        </Marker>
        <Marker position={[18.4144,	73.5069]} icon={customIcon}>
          <Popup>
            STATE : MAHARASHTRA <br /> DISTRICT : PUNE <br /> STATION : CHRIST_UNIVERSITY_LAVASA
          </Popup>
        </Marker>
        <Marker position={[18.4659,	73.9244]} icon={customIcon}>
          <Popup>
            STATE : MAHARASHTRA <br /> DISTRICT : PUNE <br /> STATION : DPS_HADAPSAR_PUNE
          </Popup>
        </Marker>
        <Marker position={[18.724,	73.3697]} icon={customIcon}>
          <Popup>
            STATE : MAHARASHTRA <br /> DISTRICT : PUNE <br /> STATION : INS_SHIVAJI_LONAVALA
          </Popup>
        </Marker>
        <Marker position={[18.5056,	74.3304]} icon={customIcon}>
          <Popup>
            STATE : MAHARASHTRA <br /> DISTRICT : PUNE <br /> STATION : KHUTBAV_DAUND
          </Popup>
        </Marker>
        <Marker position={[18.4697,	74.0013]} icon={customIcon}>
          <Popup>
            STATE : MAHARASHTRA <br /> DISTRICT : PUNE <br /> STATION : LONIKALBHOR_HAVELI
          </Popup>
        </Marker>
        <Marker position={[19.1003,	73.9655]} icon={customIcon}>
          <Popup>
            STATE : MAHARASHTRA <br /> DISTRICT : PUNE <br /> STATION : NARAYANGAON_KRISHI_KENDRA
          </Popup>
        </Marker>
        <Marker position={[18.153,	74.5003]} icon={customIcon}>
          <Popup>
            STATE : MAHARASHTRA <br /> DISTRICT : PUNE <br /> STATION : NIASM_BARAMATI
          </Popup>
        </Marker>
        <Marker position={[18.841,	73.884]} icon={customIcon}>
          <Popup>
            STATE : MAHARASHTRA <br /> DISTRICT : PUNE <br /> STATION : RAJGURUNAGAR
          </Popup>
        </Marker>
        <Marker position={[18.722,	73.6632]} icon={customIcon}>
          <Popup>
            STATE : MAHARASHTRA <br /> DISTRICT : PUNE <br /> STATION : TALEGAON
          </Popup>
        </Marker>
        {/* Render GeoJSON layer if data is available */}
        {geoData && <GeoJSON data={geoData} style={geoStyle} />}
      </MapContainer>
    </div>
  );
};

export default CustomMap;
