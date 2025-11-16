import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import { useThemeColor } from "@/hooks/useThemeColor";
import { CircleX, Map } from "lucide-react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { TouchableOpacity, View } from "react-native";
import { WebView } from "react-native-webview";
import { Icon } from "../ui/icon";
import { Pressable } from "../ui/pressable";

type Coordinates = { lat: number; lng: number };
export type AddressSelection = { address: string; coordinates: Coordinates };

type Suggestion = {
  place_id: string | number;
  display_name: string;
  lat: string;
  lon: string;
};

type AddressPickerProps = {
  value?: AddressSelection | null;
  placeholder?: string;
  onSelect: (value: AddressSelection) => void;
};

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";

export function AddressPicker({
  value,
  placeholder = "Search address",
  onSelect,
}: AddressPickerProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const color = useThemeColor({}, "text");
  // Fetch suggestions from Nominatim with debouncing
  useEffect(() => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      setSearchError(null);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        setSearchError(null);
        const url = `${NOMINATIM_BASE}/search?format=json&q=${encodeURIComponent(
          query
        )}&addressdetails=0&limit=5`;
        const res = await fetch(url, {
          headers: {
            Accept: "application/json",
            // Be polite to Nominatim per usage policy
            "User-Agent": "crowdshipping-users-app/1.0 (AddressPicker)",
          },
        });
        const data: Suggestion[] = await res.json();
        setSuggestions(data || []);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const handlePick = useCallback(
    (s: Suggestion) => {
      const selection: AddressSelection = {
        address: s.display_name,
        coordinates: { lat: parseFloat(s.lat), lng: parseFloat(s.lon) },
      };
      onSelect(selection);
      setQuery(s.display_name);
      setSuggestions([]);
    },
    [onSelect]
  );
  const handleHideSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);
  const handleClear = useCallback(() => {
    setQuery("");
    setSuggestions([]);
    // Propagate clear to parent so controlled value also clears
    onSelect({ address: "", coordinates: { lat: 0, lng: 0 } });
    setSearchError(null);
  }, [onSelect]);

  const initialCoords = useMemo<Coordinates>(() => {
    if (value?.coordinates) return value.coordinates;
    return { lat: 0, lng: 0 };
  }, [value]);

  const onMapMessage = useCallback(
    async (event: any) => {
      // Handle messages from the WebView (map click, logs, etc.)
      let payload: any = null;
      try {
        payload = JSON.parse(event?.nativeEvent?.data || "{}");
      } catch {
        payload = null;
      }

      if (!payload || payload.type !== "map_click") return;

      const lat = Number(payload.lat);
      const lng = Number(payload.lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

      // 1) Immediately select with a fallback string so the input is prefilling even if network fails
      const fallbackDisplay = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      const baseSelection: AddressSelection = {
        address: fallbackDisplay,
        coordinates: { lat, lng },
      };
      onSelect(baseSelection);
      setQuery(fallbackDisplay);
      setMapOpen(false);

      // 2) Try to reverse geocode in the background and update to a nicer address if available
      try {
        const url = `${NOMINATIM_BASE}/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=0`;
        const res = await fetch(url, {
          headers: {
            Accept: "application/json",
            "Accept-Language": "en",
            // Be polite: identify the app as per Nominatim policy
            "User-Agent": "crowdshipping-users-app/1.0 (AddressPicker)",
          },
        });
        const data = await res.json();
        const display = data?.display_name?.trim();
        if (display && typeof display === "string") {
          const selection: AddressSelection = {
            address: display,
            coordinates: { lat, lng },
          };
          onSelect(selection);
          setQuery(display);
        }
      } catch {
        // If reverse geocoding fails, we've already populated with fallback; no-op
      }
    },
    [onSelect]
  );

  const resolveTypedQuery = useCallback(async () => {
    const trimmed = query.trim();
    if (trimmed.length < 3) return;

    if (suggestions.length > 0) {
      handlePick(suggestions[0]);
      setSearchError(null);
      return;
    }

    try {
      setLoading(true);
      setSearchError(null);
      const url = `${NOMINATIM_BASE}/search?format=json&q=${encodeURIComponent(
        trimmed
      )}&addressdetails=0&limit=1`;
      const res = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": "crowdshipping-users-app/1.0 (AddressPicker)",
        },
      });
      const data: Suggestion[] = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        handlePick(data[0]);
        setSearchError(null);
      } else {
        setSearchError(
          "We couldn't find that address. Try a more specific search or drop a pin on the map."
        );
      }
    } catch {
      setSearchError(
        "We couldn't look up that address right now. Check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }, [query, suggestions, handlePick]);

  const trimmedQuery = query.trim();
  const canResolveQuery = trimmedQuery.length >= 3;

  return (
    <ThemedView>
      <View>
        <ThemedView className="flex-row gap-2">
          <Input
            size="2xl"
            className="w-full flex-1 rounded-lg border-primary-100 bg-primary-inputShade px-2"
          >
            <InputField
              placeholder={placeholder}
              value={query || value?.address || ""}
              onChangeText={(t) => {
                setQuery(t);
              }}
              style={{ fontSize: 20 }}
              autoCapitalize="none"
              autoCorrect={false}
              onSubmitEditing={() => {
                void resolveTypedQuery();
              }}
              returnKeyType="search"
            />

            {!!(query || value?.address) && (
              <Pressable onPress={handleClear}>
                <CircleX color={"gray"} />
              </Pressable>
            )}
          </Input>
          <Button
            variant="outline"
            size="2xl"
            className="border-typography-300 w-10"
            onPress={() => setMapOpen(true)}
            isDisabled={loading}
          >
            <Icon
              as={Map}
              size="xl"
              style={{
                color: "" + color,
              }}
              className="text-typography-900"
            />
          </Button>
        </ThemedView>
        {suggestions.length > 0 && (
          <ThemedView className="bg-white rounded-md border border-outline-200 mt-1 overflow-hidden">
            {suggestions.map((s, idx) => (
              <Button
                key={`${s.place_id}-${idx}`}
                variant="link"
                size="xl"
                className="justify-start px-2 mt-2"
                onPress={() => handlePick(s)}
              >
                <ThemedText numberOfLines={2}>{s.display_name}</ThemedText>
              </Button>
            ))}
            {/* hide suggestions onClick*/}
            <Button
              className="flex justify-start"
              variant="link"
              onPress={handleHideSuggestions}
            >
              {canResolveQuery && (
                <Button
                  variant="link"
                  size="xl"
                  className="justify-start px-2 mt-2"
                  onPress={() => {
                    void resolveTypedQuery();
                  }}
                  isDisabled={loading}
                >
                  <ThemedText numberOfLines={2}>
                    Use “{trimmedQuery}”
                  </ThemedText>
                </Button>
              )}
              {searchError && (
                <ThemedText
                  type="btn_medium"
                  className="text-error-500 px-2 mt-1"
                >
                  {searchError}
                </ThemedText>
              )}
            </Button>
            <TouchableOpacity onPress={handleHideSuggestions} className=" py-2">
              <ThemedText
                type="btn_medium"
                className="text-left px-2 underline"
              >
                Hide
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        )}
      </View>

      <Modal isOpen={mapOpen} onClose={() => setMapOpen(false)} size="full">
        <ModalBackdrop />
        <ModalContent style={{ flex: 1, height: "100%", width: "100%" }}>
          <ModalHeader className="pt-10">
            <ThemedText type="h5_header">Tap on the map to select</ThemedText>
          </ModalHeader>
          <ModalBody
            contentContainerStyle={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              minHeight: 400,
              padding: 0,
            }}
          >
            <View style={{ width: "100%", height: "100%", maxHeight: 700 }}>
              <WebView
                originWhitelist={["*"]}
                style={{ flex: 1, width: "100%", height: "100%" }}
                onMessage={onMapMessage}
                source={{ html: leafletHtml(initialCoords) }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                allowFileAccess={true}
                allowUniversalAccessFromFileURLs={true}
                mixedContentMode="always"
                androidLayerType="hardware"
                startInLoadingState={true}
                onLoadEnd={() => console.log("Map loaded")}
                onError={(syntheticEvent) => {
                  const { nativeEvent } = syntheticEvent;
                  console.warn("WebView error: ", nativeEvent);
                }}
              />
            </View>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              className="w-full mb-2"
              size="2xl"
              onPress={() => setMapOpen(false)}
            >
              <ThemedText className="text-primary-500" type="btn_large">
                Close
              </ThemedText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ThemedView>
  );
}

function leafletHtml(center: Coordinates) {
  const { lat, lng } = center;
  // Simple Leaflet map that posts back clicked lat/lng
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link
      rel="stylesheet"
      href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
      crossorigin=""
    />
    <style>
      html, body { height: 100%; width: 100%; margin: 0; padding: 0; overflow: hidden; }
      #map { 
        position: absolute; 
        {canResolveQuery && (
          <Button
            variant="link"
            size="xl"
            className="justify-start px-2 mt-2"
            onPress={() => {
              void resolveTypedQuery();
            }}
            isDisabled={loading}
          >
            <ThemedText numberOfLines={2}>
              Use “{trimmedQuery}”
            </ThemedText>
          </Button>
        )}
        {searchError && (
          <ThemedText
            type="btn_medium"
            className="text-error-500 px-2 mt-1"
          >
            {searchError}
          </ThemedText>
        )}
        inset: 0; 
        height: 100%; 
        width: 100%; 
        z-index: 1;
      }
      .leaflet-container { 
        touch-action: auto !important; 
        height: 100% !important;
        width: 100% !important;
      }
      /* Ensure map tiles load */
      .leaflet-tile-pane { z-index: 2; }
      .leaflet-control-container { z-index: 10; }
      /* Fix possible pointer-events issues inside WebView */
      .leaflet-pane, .leaflet-top, .leaflet-bottom { pointer-events: auto; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
    <script>
      (function() {
        // Bridge helpers
        function postToRN(obj) {
          try {
            const msg = JSON.stringify(obj);
            if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
              window.ReactNativeWebView.postMessage(msg);
            } else if (window.parent && window.parent !== window) {
              window.parent.postMessage(msg, '*');
            } else {
              console.log('Bridge fallback:', msg);
            }
          } catch (e) { console.log('postToRN error', e); }
        }

        // Forward console logs to RN for diagnostics
        ['log','warn','error'].forEach(function(level) {
          const orig = console[level];
          console[level] = function() {
            try { postToRN({ type: 'log', level, args: Array.from(arguments).map(String) }); } catch {}
            orig && orig.apply(console, arguments);
          };
        });

        document.addEventListener('DOMContentLoaded', function() {
          try {
            const center = [${lat}, ${lng}];
            const defaultCenter = center[0] === 0 && center[1] === 0 ? [51.5074, -0.1278] : center;
            console.log('Creating map with center:', defaultCenter);

            const map = L.map('map', {
              center: defaultCenter,
              zoom: 13,
              zoomControl: true,
              scrollWheelZoom: true,
              doubleClickZoom: true,
              touchZoom: true
            });

            const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 19,
              attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            tiles.on('tileerror', function(err) {
              postToRN({ type: 'tileerror', message: String(err && err.error) });
            });

            let marker = null;

            function sendClick(lat, lng) {
              console.log('Sending coordinates:', lat, lng);
              postToRN({ type: 'map_click', lat, lng });
            }

            map.on('click', function(e) {
              const { lat, lng } = e.latlng;
              console.log('Map clicked:', lat, lng);
              if (marker) { marker.setLatLng([lat, lng]); } else { marker = L.marker([lat, lng]).addTo(map); }
              sendClick(lat, lng);
            });

            // Add initial marker if coordinates provided
            if (center[0] !== 0 || center[1] !== 0) {
              marker = L.marker(center).addTo(map);
            }

            // Ensure map renders after container layout
            setTimeout(function(){ map.invalidateSize(); }, 0);
            window.addEventListener('resize', function(){ map.invalidateSize(); });

            postToRN({ type: 'ready' });
            console.log('Map initialized successfully');
          } catch (error) {
            console.error('Error initializing map:', error);
            postToRN({ type: 'error', message: String(error && error.message || error) });
            document.body.innerHTML = '<div style="padding: 20px; text-align: center;">Map failed to load: ' + (error && error.message || error) + '</div>';
          }
        });
      })();
    </script>
  </body>
</html>`;
}

export default AddressPicker;
