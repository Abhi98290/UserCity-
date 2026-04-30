import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Image, Linking } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import Icon from 'react-native-vector-icons/Ionicons';

const GOOGLE_API_KEY = 'AIzaSyAJ8mnmfeiGdK_JmnlcvwznLuQs57OjnhA';

const RideTrackingScreen = ({ route, navigation }) => {
  const { pickup, drop, service, pickupAddress, dropAddress } = route.params;
  const mapRef = useRef(null);
  
  // Driver initial location (away from pickup)
  const initialDriverLocation = {
    latitude: pickup.latitude + 0.008,
    longitude: pickup.longitude + 0.008,
  };

  // Mock driver data
  const [driver] = useState({
    name: "Rajesh Kumar",
    rating: 4.8,
    vehicle: "Auto - RJ 14 AB 1234",
    phone: "+91 98765 43210",
    photo: "https://via.placeholder.com/100",
  });

  const [driverLocation, setDriverLocation] = useState(initialDriverLocation);
  const [rideStatus, setRideStatus] = useState("arriving"); // arriving, pickup, ongoing, completed
  const [eta, setEta] = useState("8 mins");
  const [routeToPickup, setRouteToPickup] = useState([]);
  const [routeToDrop, setRouteToDrop] = useState([]);
  const [fullRoute, setFullRoute] = useState([]);
  const animationRef = useRef(null);

  // Decode Google polyline to coordinates
  const decodePolyline = (encoded) => {
    const poly = [];
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0;

    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      poly.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }
    return poly;
  };

  // Fetch real road route from Google Directions API
  const fetchRoute = async (origin, destination) => {
    try {
      console.log(`🔍 Fetching route from (${origin.latitude}, ${origin.longitude}) to (${destination.latitude}, ${destination.longitude})`);
      
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${GOOGLE_API_KEY}&mode=driving`
      );
      const data = await response.json();
      
      console.log('📡 API Response status:', data.status);
      
      if (data.status === 'OK' && data.routes && data.routes.length > 0) {
        const points = decodePolyline(data.routes[0].overview_polyline.points);
        console.log(`✅ Route fetched: ${points.length} points`);
        return points;
      } else {
        console.log('⚠️ No route found, using fallback. Status:', data.status);
        // Fallback: Generate curved path
        return generateFallbackPath(origin, destination);
      }
    } catch (error) {
      console.log('❌ Route fetch error:', error);
      // Fallback: Generate curved path
      return generateFallbackPath(origin, destination);
    }
  };

  // Fallback: Generate smooth curved path
  const generateFallbackPath = (start, end, steps = 60) => {
    const path = [];
    for (let i = 0; i <= steps; i++) {
      const ratio = i / steps;
      // Add curve to simulate road
      const curveFactor = Math.sin(ratio * Math.PI) * 0.003;
      path.push({
        latitude: start.latitude + (end.latitude - start.latitude) * ratio + curveFactor,
        longitude: start.longitude + (end.longitude - start.longitude) * ratio - curveFactor * 0.5,
      });
    }
    console.log(`🔄 Generated fallback path: ${path.length} points`);
    return path;
  };

  // Animate driver movement along path
  const animateDriver = (path, onComplete) => {
    let currentIndex = 0;
    
    const moveDriver = () => {
      if (currentIndex < path.length) {
        setDriverLocation(path[currentIndex]);
        
        // Update ETA based on progress
        const remaining = path.length - currentIndex;
        const mins = Math.max(1, Math.ceil(remaining / 10));
        setEta(`${mins} min${mins > 1 ? 's' : ''}`);
        
        // Animate camera to follow driver
        if (mapRef.current) {
          mapRef.current.animateCamera({
            center: path[currentIndex],
            zoom: 16,
          }, { duration: 400 });
        }
        
        currentIndex++;
        animationRef.current = setTimeout(moveDriver, 400); // Move every 400ms
      } else {
        if (onComplete) onComplete();
      }
    };
    
    moveDriver();
  };

  useEffect(() => {
    const initializeRoutes = async () => {
      console.log('🗺️ Fetching real road routes...');
      
      // Fetch route from driver to pickup
      const pathToPickup = await fetchRoute(initialDriverLocation, pickup);
      setRouteToPickup(pathToPickup);
      
      // Fetch route from pickup to drop
      const pathToDrop = await fetchRoute(pickup, drop);
      setRouteToDrop(pathToDrop);
      setFullRoute(pathToDrop);
      
      // Initial map fit
      if (mapRef.current) {
        setTimeout(() => {
          mapRef.current?.fitToCoordinates(
            [initialDriverLocation, pickup, drop],
            {
              edgePadding: { top: 100, right: 50, bottom: 350, left: 50 },
              animated: true,
            }
          );
        }, 500);
      }

      // Start animation after routes are loaded
      if (pathToPickup.length > 0) {
        setTimeout(() => {
          animateDriver(pathToPickup, () => {
            console.log("✅ Driver reached pickup");
            setRideStatus("pickup");
            setEta("Arrived");
            
            // Wait 3 seconds at pickup, then move to drop
            setTimeout(() => {
              setRideStatus("ongoing");
              setEta("12 mins");
              
              if (pathToDrop.length > 0) {
                animateDriver(pathToDrop, () => {
                  console.log("✅ Driver reached drop");
                  setRideStatus("completed");
                  setEta("Completed");
                });
              }
            }, 3000);
          });
        }, 1000);
      }
    };

    initializeRoutes();

    // Cleanup
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  const handleCall = () => {
    Linking.openURL(`tel:${driver.phone}`);
  };

  const getStatusMessage = () => {
    switch (rideStatus) {
      case "arriving":
        return `Driver arriving in ${eta}`;
      case "pickup":
        return "Driver has arrived at pickup";
      case "ongoing":
        return `Arriving at destination in ${eta}`;
      case "completed":
        return "Trip completed!";
      default:
        return "";
    }
  };

  const getRouteCoordinates = () => {
    if (rideStatus === "arriving" && routeToPickup.length > 0) {
      return routeToPickup;
    } else if (rideStatus === "ongoing" && routeToDrop.length > 0) {
      return routeToDrop;
    }
    return [];
  };

  const getActiveRoute = () => {
    if (rideStatus === "arriving" && routeToPickup.length > 0) {
      // Show only the remaining route from driver to pickup
      const driverIndex = routeToPickup.findIndex(point => 
        Math.abs(point.latitude - driverLocation.latitude) < 0.0001 &&
        Math.abs(point.longitude - driverLocation.longitude) < 0.0001
      );
      if (driverIndex !== -1) {
        return routeToPickup.slice(driverIndex);
      }
      return routeToPickup;
    } else if (rideStatus === "ongoing" && routeToDrop.length > 0) {
      // Show only the remaining route from driver to drop
      const driverIndex = routeToDrop.findIndex(point => 
        Math.abs(point.latitude - driverLocation.latitude) < 0.0001 &&
        Math.abs(point.longitude - driverLocation.longitude) < 0.0001
      );
      if (driverIndex !== -1) {
        return routeToDrop.slice(driverIndex);
      }
      return routeToDrop;
    }
    return [];
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: pickup.latitude,
          longitude: pickup.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        showsUserLocation={false}
        showsMyLocationButton={false}
      >
        {/* Driver Marker - Animated */}
        <Marker
          coordinate={driverLocation}
          title="Driver"
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <View style={styles.driverMarker}>
            <Text style={styles.driverMarkerText}>🚗</Text>
          </View>
        </Marker>

        {/* Pickup Marker */}
        {rideStatus !== "completed" && (
          <Marker
            coordinate={pickup}
            title="Pickup Location"
          >
            <View style={styles.pickupMarker}>
              <View style={styles.pickupDot} />
            </View>
          </Marker>
        )}

        {/* Drop Marker */}
        <Marker
          coordinate={drop}
          title="Drop Location"
        >
          <View style={styles.dropMarker}>
            <View style={styles.dropDot} />
          </View>
        </Marker>

        {/* Route Line - Active route (Blue like Swiggy/Zomato) */}
        {getActiveRoute().length > 0 && (
          <Polyline
            coordinates={getActiveRoute()}
            strokeColor="#2563eb"
            strokeWidth={5}
          />
        )}

        {/* Full route line (Gray - pickup to drop) */}
        {fullRoute.length > 0 && rideStatus === "arriving" && (
          <Polyline
            coordinates={fullRoute}
            strokeColor="#9ca3af"
            strokeWidth={4}
            lineDashPattern={[8, 4]}
          />
        )}
      </MapView>

      {/* Driver Info Card */}
      <View style={styles.driverCard}>
        <View style={styles.driverHeader}>
          <View style={styles.driverInfo}>
            <Image 
              source={{ uri: driver.photo }} 
              style={styles.driverPhoto}
            />
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>{driver.name}</Text>
              <View style={styles.ratingRow}>
                <Icon name="star" size={14} color="#fbbf24" />
                <Text style={styles.rating}>{driver.rating}</Text>
              </View>
              <Text style={styles.vehicle}>{driver.vehicle}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.callButton} onPress={handleCall}>
            <Icon name="call" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* ETA */}
        <View style={styles.etaSection}>
          <Icon name="time-outline" size={20} color="#6b7280" />
          <Text style={styles.etaText}>{getStatusMessage()}</Text>
        </View>

        {rideStatus === "pickup" && (
          <View style={styles.statusBanner}>
            <Text style={styles.statusBannerText}>🎉 Driver has arrived! Please board the vehicle</Text>
          </View>
        )}

        {rideStatus === "completed" && (
          <View style={[styles.statusBanner, { backgroundColor: "#10b981" }]}>
            <Text style={styles.statusBannerText}>✅ Trip completed successfully!</Text>
          </View>
        )}

        <View style={styles.divider} />

        {/* Trip Details */}
        <View style={styles.tripDetails}>
          <View style={styles.locationRow}>
            <View style={[styles.locationDot, { backgroundColor: "#10b981" }]} />
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationLabel}>Pickup</Text>
              <Text style={styles.locationAddress} numberOfLines={1}>
                {pickupAddress}
              </Text>
            </View>
          </View>

          <View style={styles.locationRow}>
            <View style={[styles.locationDot, { backgroundColor: "#ef4444" }]} />
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationLabel}>Drop</Text>
              <Text style={styles.locationAddress} numberOfLines={1}>
                {dropAddress}
              </Text>
            </View>
          </View>
        </View>

        {/* Cancel Button */}
        {rideStatus !== "completed" && (
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => {
              if (animationRef.current) {
                clearTimeout(animationRef.current);
              }
              navigation.goBack();
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel Ride</Text>
          </TouchableOpacity>
        )}

        {rideStatus === "completed" && (
          <TouchableOpacity 
            style={styles.doneButton}
            onPress={() => navigation.navigate('Main')}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  map: {
    flex: 1,
  },
  driverMarker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#111827",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  driverMarkerText: {
    fontSize: 22,
  },
  pickupMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#10b981",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
    elevation: 3,
  },
  pickupDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  dropMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
    elevation: 3,
  },
  dropDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  driverCard: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  driverHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  driverInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  driverPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    backgroundColor: "#e5e7eb",
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginLeft: 4,
  },
  vehicle: {
    fontSize: 13,
    color: "#6b7280",
  },
  callButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#10b981",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 16,
  },
  etaSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 12,
  },
  etaText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginLeft: 8,
  },
  tripDetails: {
    gap: 12,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 14,
    color: "#111827",
  },
  cancelButton: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ef4444",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ef4444",
  },
  doneButton: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#10b981",
    alignItems: "center",
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  statusBanner: {
    backgroundColor: "#fbbf24",
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  statusBannerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
  },
});

export default RideTrackingScreen;
