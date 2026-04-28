import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, PermissionsAndroid, Platform, TouchableOpacity, TextInput, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import ServiceModal from "../components/ServiceModal";

const HomeScreen = () => {
  console.log("=== HomeScreen rendered ===");

  const mapRef = useRef(null);
  const hasCenteredMapRef = useRef(false);
  const [permissionStatus, setPermissionStatus] = useState("Map loaded");
  const [userLocation, setUserLocation] = useState(null);
  const [destinationText, setDestinationText] = useState("");
  const [selectedService, setSelectedService] = useState("taxi");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [selectedServiceDetails, setSelectedServiceDetails] = useState(null);

  const services = [
    { key: "home", title: "Home Services", subtitle: "Repair, cleaning", eta: "12 min", fare: "from Rs 149", icon: require("../assets/Home_Service.png") },
    { key: "porter", title: "Porter", subtitle: "Move goods fast", eta: "9 min", fare: "from Rs 99", icon: require("../assets/Porter.png") },
    { key: "taxi", title: "Taxi", subtitle: "Book nearby rides", eta: "4 min", fare: "from Rs 129", icon: require("../assets/Taxi.png") },
    { key: "delivery", title: "Delivery", subtitle: "Send packages", eta: "18 min", fare: "from Rs 89", icon: require("../assets/Delivery.png") },
  ];

  const initialRegion = {
    latitude: 26.9124,
    longitude: 75.7873,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05
  };

  useEffect(() => {
    console.log("useEffect started");
    let isMounted = true;
    let watchId = null;

    const requestLocationPermission = async () => {
      console.log("Requesting permission...");
      
      if (Platform.OS === "android") {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: "Location Permission",
              message: "UserCity needs your location",
              buttonPositive: "Allow",
            }
          );
          console.log("Permission result:", granted);
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
          console.error("Permission error:", err);
          return false;
        }
      }

      if (Platform.OS === "ios") {
        try {
          const auth = await Geolocation.requestAuthorization("whenInUse");
          return auth === "granted";
        } catch (err) {
          console.error("iOS permission error:", err);
          return false;
        }
      }

      return true;
    };

    const startLocationTracking = async () => {
      const hasPermission = await requestLocationPermission();
      
      if (!hasPermission) {
        console.log("Permission denied");
        if (isMounted) setPermissionStatus("Location permission denied");
        return;
      }

      console.log("Getting location...");
      if (isMounted) setPermissionStatus("Fetching location...");

      try {
        watchId = Geolocation.watchPosition(
          (position) => {
            console.log("✅ Location success:", position.coords);
            if (isMounted) {
              setUserLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
                   console.log("Updated latitude:", position.coords.latitude); 
                    console.log("Updated longitude:", position.coords.longitude);
              setPermissionStatus("Live location tracking enabled");
            }
          },
          (error) => {
            console.error("❌ Location error:", error.code, error.message);
            if (isMounted) {
              if (error.code === 1) {
                setPermissionStatus("Location permission denied");
              } else if (error.code === 2) {
                setPermissionStatus("Location unavailable. Turn on GPS/Location.");
              } else if (error.code === 3) {
                setPermissionStatus("Location timeout. Retrying may help.");
              } else {
                setPermissionStatus(`Location error: ${error.message}`);
              }
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
            showLocationDialog: true,
            forceRequestLocation: true,
            forceLocationManager: true,
            distanceFilter: 10,
            interval: 5000,
            fastestInterval: 2000,
          }
        );
      } catch (err) {
        console.error("Geolocation crash-safe error:", err);
        if (isMounted) {
          setPermissionStatus("Location service unavailable");
        }
      }
    };

    console.log("Starting location tracking...");
    startLocationTracking();

    return () => {
      console.log("Cleanup");
      isMounted = false;
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
        Geolocation.stopObserving();
      }
    };
  }, []);

  const recenterToUser = () => {
    if (!mapRef.current || !userLocation) {
      return;
    }

    mapRef.current.animateToRegion(
      {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      600
    );
  };

  useEffect(() => {
    if (!userLocation || hasCenteredMapRef.current || !mapRef.current) {
      return;
    }

    mapRef.current.animateToRegion(
      {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      800
    );

    hasCenteredMapRef.current = true;
  }, [userLocation]);

  const handleDestinationChange = (text) => {
    setDestinationText(text);
    setIsSheetOpen(false);
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service.key);
    setSelectedServiceDetails(service);
    setIsServiceModalOpen(true);
  };

  const handleBookService = (service) => {
    console.log(`Booking ${service.title}`);
    // Add booking logic here
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        onMapReady={() => console.log("✅ Map is ready")}
        onError={(error) => console.error("❌ Map error:", error)}
      >
        {userLocation && (
          <Marker 
            coordinate={userLocation} 
            title="You are here"
            pinColor="red"
          />
        )}
      </MapView>

      <View style={styles.searchBarWrap}>
        <View style={styles.topCard}>
          <View style={styles.topRow}>
            <Text style={styles.brandLabel}>UserCity</Text>
            <View style={styles.liveBadge}>
              <Text style={styles.liveBadgeText}>LIVE</Text>
            </View>
          </View>

          <Text style={styles.whereToLabel}>Where to?</Text>
          <TextInput
            value={destinationText}
            onChangeText={handleDestinationChange}
            onFocus={() => setIsSheetOpen(false)}
            placeholder="Search destination"
            placeholderTextColor="#7c8797"
            style={styles.searchInput}
          />

          <View style={styles.quickPillsRow}>
            <View style={styles.quickPill}><Text style={styles.quickPillText}>Home</Text></View>
            <View style={styles.quickPill}><Text style={styles.quickPillText}>Work</Text></View>
            <View style={styles.quickPill}><Text style={styles.quickPillText}>Saved</Text></View>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.recenterButton,
          isSheetOpen ? styles.recenterButtonHigh : styles.recenterButtonLow,
          !userLocation && styles.recenterButtonDisabled,
        ]}
        onPress={recenterToUser}
        disabled={!userLocation}
      >
        <Text style={styles.recenterText}>◎</Text>
      </TouchableOpacity>

      {isSheetOpen ? (
        <View style={styles.bottomSheet}>
          <TouchableOpacity 
            style={styles.sheetHandleTouch} 
            onPress={() => setIsSheetOpen(false)} 
            activeOpacity={0.8}
          >
            <View style={styles.sheetHandle} />
          </TouchableOpacity>

          <Text style={styles.sheetTitle}>Choose Service</Text>
          <Text style={styles.sheetStatus}>{permissionStatus}</Text>

          <View style={styles.servicesList}>
            {services.map((service) => (
              <TouchableOpacity
                key={service.key}
                style={[
                  styles.serviceCard,
                  selectedService === service.key && styles.serviceCardActive,
                ]}
                activeOpacity={0.85}
                onPress={() => handleServiceSelect(service)}
              >
                <View style={styles.serviceIconWrap}>
                  <Image source={service.icon} style={styles.serviceIconImage} resizeMode="contain" />
                </View>

                <View style={styles.serviceMeta}>
                  <Text style={styles.serviceTitle}>{service.title}</Text>
                  <Text style={styles.serviceSubtitle}>{service.subtitle}</Text>
                </View>

                <View style={styles.serviceRight}>
                  <Text style={styles.serviceEta}>{service.eta}</Text>
                  <Text style={styles.serviceFare}>{service.fare}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.collapsedSheetTab}>
          <TouchableOpacity 
            style={styles.sheetHandleTouch} 
            onPress={() => setIsSheetOpen(true)} 
            activeOpacity={0.8}
          >
            <View style={styles.sheetHandle} />
          </TouchableOpacity>
          
          <View style={styles.collapsedServicesRow}>
            {services.map((service) => (
              <TouchableOpacity
                key={service.key}
                style={[
                  styles.collapsedServiceItem,
                  selectedService === service.key && styles.collapsedServiceItemActive,
                ]}
                onPress={() => setSelectedService(service.key)}
                activeOpacity={0.85}
              >
                <Image source={service.icon} style={styles.collapsedServiceIconImage} resizeMode="contain" />
                <Text style={styles.collapsedServiceLabel}>{service.title.split(" ")[0]}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* <TouchableOpacity 
            style={styles.collapsedMoreButton} 
            onPress={() => setIsSheetOpen(true)} 
            activeOpacity={0.9}
          >
            <Text style={styles.collapsedMoreText}>OPEN</Text>
          </TouchableOpacity> */}
        </View>
      )}

      {/* Service Details Modal */}
      <ServiceModal
        visible={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        service={selectedServiceDetails}
        onBook={handleBookService}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  searchBarWrap: {
    position: "absolute",
    top: 14,
    left: 16,
    right: 16,
  },
  topCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 6,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  brandLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: 0.3,
  },
  liveBadge: {
    backgroundColor: "#111827",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  liveBadgeText: {
    color: "#f8fafc",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  whereToLabel: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },
  searchInput: {
    height: 44,
    backgroundColor: "#f3f5f8",
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#111827",
  },
  quickPillsRow: {
    marginTop: 10,
    flexDirection: "row",
    columnGap: 8,
  },
  quickPill: {
    backgroundColor: "#eef2ff",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  quickPillText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
  },
  recenterButton: {
    position: "absolute",
    right: 16,
    backgroundColor: "#111827",
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  recenterButtonHigh: {
    bottom: 420,
  },
  recenterButtonLow: {
    bottom: 120,
  },
  recenterButtonDisabled: {
    backgroundColor: "#6b7280"
  },
  recenterText: {
    color: "#f8fafc",
    fontSize: 20,
    fontWeight: "700"
  },
  bottomSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#f8fafc",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 22,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  sheetHandleTouch: {
    alignItems: "center",
    paddingVertical: 8,
    paddingBottom: 12,
  },
  sheetHandle: {
    alignSelf: "center",
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#cbd5e1",
  },
  sheetTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  sheetStatus: {
    marginTop: 4,
    marginBottom: 12,
    fontSize: 12,
    color: "#475569"
  },
  servicesList: {
    rowGap: 10,
  },
  serviceCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 11,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    flexDirection: "row",
    alignItems: "center",
  },
  serviceCardActive: {
    borderColor: "#111827",
    backgroundColor: "#f1f5f9",
  },
  serviceIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 9,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  serviceIconImage: {
    width: 22,
    height: 22,
  },
  serviceMeta: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827"
  },
  serviceSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#6b7280"
  },
  serviceRight: {
    alignItems: "flex-end",
    marginLeft: 10,
  },
  serviceEta: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
  },
  serviceFare: {
    marginTop: 3,
    fontSize: 11,
    color: "#475569",
  },
  collapsedSheetTab: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#f8fafc",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  collapsedServicesRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: -2,
  },
  collapsedServiceItem: {
    width: "23%",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  collapsedServiceItemActive: {
    borderColor: "#111827",
    backgroundColor: "#f1f5f9",
  },
  collapsedServiceIconImage: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  collapsedServiceLabel: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: "700",
    color: "#334155",
  },
  collapsedMoreButton: {
    alignSelf: "center",
    marginTop: 12,
    backgroundColor: "#111827",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  collapsedMoreText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
  }
});

export default HomeScreen;
