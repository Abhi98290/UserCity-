import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Image, Linking } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import Icon from 'react-native-vector-icons/Ionicons';

const RideTrackingScreen = ({ route, navigation }) => {
  const { pickup, drop, service, pickupAddress, dropAddress } = route.params;
  const mapRef = useRef(null);
  
  // Mock driver data
  const [driver] = useState({
    name: "Rajesh Kumar",
    rating: 4.8,
    vehicle: "Auto - RJ 14 AB 1234",
    phone: "+91 98765 43210",
    photo: "https://via.placeholder.com/100",
    location: {
      latitude: pickup.latitude + 0.002,
      longitude: pickup.longitude + 0.002,
    }
  });

  const [eta] = useState("5 mins");

  useEffect(() => {
    // Fit map to show both pickup and driver location
    if (mapRef.current && pickup && driver.location) {
      setTimeout(() => {
        mapRef.current?.fitToCoordinates(
          [pickup, driver.location],
          {
            edgePadding: { top: 100, right: 50, bottom: 300, left: 50 },
            animated: true,
          }
        );
      }, 500);
    }
  }, []);

  const handleCall = () => {
    Linking.openURL(`tel:${driver.phone}`);
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
      >
        {/* Driver Marker */}
        <Marker
          coordinate={driver.location}
          title="Driver"
        >
          <View style={styles.driverMarker}>
            <Text style={styles.driverMarkerText}>🚗</Text>
          </View>
        </Marker>

        {/* Pickup Marker */}
        <Marker
          coordinate={pickup}
          pinColor="#10b981"
          title="Pickup Location"
        />

        {/* Drop Marker */}
        <Marker
          coordinate={drop}
          pinColor="#ef4444"
          title="Drop Location"
        />

        {/* Route Line */}
        <Polyline
          coordinates={[driver.location, pickup]}
          strokeColor="#111827"
          strokeWidth={3}
          lineDashPattern={[1]}
        />
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
          <Text style={styles.etaText}>Driver arriving in {eta}</Text>
        </View>

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
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel Ride</Text>
        </TouchableOpacity>
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#111827",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  driverMarkerText: {
    fontSize: 20,
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
});

export default RideTrackingScreen;
