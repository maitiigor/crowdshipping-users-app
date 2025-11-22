import React, { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

export interface MapMarker {
  id: string;
  position: { lat: number; lng: number };
  icon?: string;
  color?:
    | "blue"
    | "red"
    | "green"
    | "orange"
    | "yellow"
    | "violet"
    | "grey"
    | "black";
  title?: string;
  description?: string;
}

export interface MapPolyline {
  positions: { lat: number; lng: number }[];
  color?: string;
  weight?: number;
}

interface LeafletMapProps {
  mapMarkers?: MapMarker[];
  mapCenterPosition?: { lat: number; lng: number };
  zoom?: number;
  initialZoom?: number;
  mapPolylines?: MapPolyline[];
  onMarkerPress?: (markerId: string) => void;
  fitToCoordinates?: { lat: number; lng: number }[];
}

const LeafletMap: React.FC<LeafletMapProps> = ({
  mapMarkers = [],
  mapCenterPosition = { lat: 51.505, lng: -0.09 },
  zoom,
  initialZoom = 2,
  mapPolylines = [],
  onMarkerPress,
  fitToCoordinates,
}) => {
  const webViewRef = useRef<WebView>(null);
  const mapZoom = zoom ?? initialZoom;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
      <style>
        body { margin: 0; padding: 0; }
        #map { width: 100%; height: 100vh; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map', { zoomControl: false }).setView([${
          mapCenterPosition.lat
        }, ${mapCenterPosition.lng}], ${mapZoom});
        
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        var markers = [];
        var polylines = [];

        // Helper for colored icons
        function getIcon(color) {
          return new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-' + (color || 'blue') + '.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });
        }

        function updateMarkers(newMarkers) {
          // Remove existing markers
          markers.forEach(m => map.removeLayer(m));
          markers = [];

          // Add new markers
          newMarkers.forEach(m => {
            var options = {};
            if (m.color) {
              options.icon = getIcon(m.color);
            }
            
            var marker = L.marker([m.position.lat, m.position.lng], options);
            
            if (m.title) {
              marker.bindPopup("<b>" + m.title + "</b>" + (m.description ? "<br>" + m.description : ""));
            }
            
            marker.on('click', function() {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'markerPress', id: m.id }));
            });

            marker.addTo(map);
            markers.push(marker);
          });
        }

        function updatePolylines(newPolylines) {
          // Remove existing polylines
          polylines.forEach(p => map.removeLayer(p));
          polylines = [];

          newPolylines.forEach(p => {
            var latlngs = p.positions.map(pos => [pos.lat, pos.lng]);
            var polyline = L.polyline(latlngs, {
              color: p.color || 'blue',
              weight: p.weight || 3
            }).addTo(map);
            polylines.push(polyline);
          });
        }

        function updateCenter(lat, lng, zoom) {
          map.setView([lat, lng], zoom);
        }

        function fitBounds(coords) {
          if (!coords || coords.length === 0) return;
          var latlngs = coords.map(c => [c.lat, c.lng]);
          var bounds = L.latLngBounds(latlngs);
          map.fitBounds(bounds, { padding: [50, 50] });
        }

        function invalidateSize() {
          setTimeout(function() {
            map.invalidateSize();
          }, 100);
        }
        
        // Initial render
        updateMarkers(${JSON.stringify(mapMarkers)});
        updatePolylines(${JSON.stringify(mapPolylines)});
        ${
          fitToCoordinates && fitToCoordinates.length > 0
            ? `fitBounds(${JSON.stringify(fitToCoordinates)});`
            : ""
        }
      </script>
    </body>
    </html>
  `;

  useEffect(() => {
    if (webViewRef.current) {
      const script = `updateMarkers(${JSON.stringify(mapMarkers)});`;
      webViewRef.current.injectJavaScript(script);
    }
  }, [mapMarkers]);

  useEffect(() => {
    if (webViewRef.current) {
      const script = `updatePolylines(${JSON.stringify(mapPolylines)});`;
      webViewRef.current.injectJavaScript(script);
    }
  }, [mapPolylines]);

  useEffect(() => {
    if (webViewRef.current) {
      const script = `updateCenter(${mapCenterPosition.lat}, ${mapCenterPosition.lng}, ${mapZoom});`;
      webViewRef.current.injectJavaScript(script);
    }
  }, [mapCenterPosition, mapZoom]);

  useEffect(() => {
    if (webViewRef.current && fitToCoordinates && fitToCoordinates.length > 0) {
      const script = `fitBounds(${JSON.stringify(fitToCoordinates)});`;
      webViewRef.current.injectJavaScript(script);
    }
  }, [fitToCoordinates]);

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "markerPress" && onMarkerPress) {
        onMarkerPress(data.id);
      }
    } catch (e) {
      console.error("Error parsing map message", e);
    }
  };

  const handleLoadEnd = () => {
    // Invalidate map size after WebView loads to ensure proper rendering
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript("invalidateSize();");
    }
  };

  return (
    <WebView
      ref={webViewRef}
      originWhitelist={["*"]}
      source={{ html: htmlContent }}
      style={styles.map}
      scrollEnabled={false}
      onMessage={handleMessage}
      onLoadEnd={handleLoadEnd}
    />
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
});

export default LeafletMap;
