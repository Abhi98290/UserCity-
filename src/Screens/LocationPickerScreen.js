import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, StatusBar, Keyboard } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Icon from 'react-native-vector-icons/Ionicons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const LocationPickerScreen = ({ route, navigation }) => {
  const { locationType } = route.params; // 'pickup' or 'drop'
  const mapRef = useRef(null);
  
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: 26.9124,
    longitude: 75.7873,
  });
  const [address, setAddress] = useState("");

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
    // You can add reverse geocoding here if needed
    setAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
  };

  const handlePlaceSelect = (data, details = null) => {
    if (details) {
      const { lat, lng } = details.geometry.location;
      const newLocation = {
        latitude: lat,
        longitude: lng,
      };
      setSelectedLocation(newLocation);
      setAddress(details.formatted_address);
      
      // Animate map to selected location
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          ...newLocation,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, 500);
      }
      
      Keyboard.dismiss();
    }
  };

  const handleConfirm = () => {
    navigation.navigate({
      name: route.params.returnScreen,
      params: {
        [locationType]: {
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          address: address || searchQuery || "Selected Location",
        },
      },
      merge: true,
    });
  };

  const recenterMap = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        ...selectedLocation,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 500);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {locationType === 'pickup' ? 'Select Pickup Location' : 'Select Drop Location'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search Bar with Google Places Autocomplete */}
      <View style={styles.searchContainer}>
        <GooglePlacesAutocomplete
          placeholder="Search location"
          fetchDetails={true}
          onPress={handlePlaceSelect}
          query={{
            key: 'YOUR_GOOGLE_API_KEY', // Replace with your API key
            language: 'en',
            components: 'country:in', // Restrict to India
          }}
          styles={{
            container: {
              flex: 0,
            },
            textInputContainer: {
              backgroundColor: 'transparent',
              borderTopWidth: 0,
              borderBottomWidth: 0,
            },
            textInput: {
              height: 44,
              color: '#111827',
              fontSize: 15,
              backgroundColor: '#fff',
              borderRadius: 12,
              paddingHorizontal: 16,
              borderWidth: 1,
              borderColor: '#e5e7eb',
            },
            listView: {
              backgroundColor: '#fff',
              borderRadius: 12,
              marginTop: 8,
              elevation: 4,
            },
            row: {
              backgroundColor: '#fff',
              padding: 13,
              height: 60,
              flexDirection: 'row',
            },
            separator: {
              height: 1,
              backgroundColor: '#e5e7eb',
            },
            description: {
              fontSize: 14,
              color: '#111827',
            },
            poweredContainer: {
              display: 'none',
            },
          }}
          enablePoweredByContainer={false}
          renderLeftButton={() => (
            <View style={styles.searchIconWrapper}>
              <Icon name="search" size={20} color="#6b7280" />
            </View>
          )}
        />
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onPress={handleMapPress}
        >
          <Marker
            coordinate={selectedLocation}
            pinColor={locationType === 'pickup' ? "#10b981" : "#ef4444"}
          />
        </MapView>

        {/* Recenter Button */}
        <TouchableOpacity style={styles.recenterButton} onPress={recenterMap}>
          <Icon name="locate" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Location Info Card */}
        <View style={styles.locationCard}>
          <View style={[styles.locationDot, { 
            backgroundColor: locationType === 'pickup' ? "#10b981" : "#ef4444" 
          }]} />
          <View style={styles.locationInfo}>
            <Text style={styles.locationLabel}>
              {locationType === 'pickup' ? 'Pickup Location' : 'Drop Location'}
            </Text>
            <Text style={styles.locationAddress} numberOfLines={2}>
              {address || "Tap on map or search location"}
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={[styles.confirmButton, !selectedLocation && styles.disabledButton]}
          disabled={!selectedLocation}
          onPress={handleConfirm}
        >
          <Text style={styles.confirmButtonText}>Confirm Location</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 8,
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    zIndex: 1,
  },
  searchIconWrapper: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 8,
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  map: {
    flex: 1,
  },
  recenterButton: {
    position: "absolute",
    right: 16,
    bottom: 120,
    backgroundColor: "#111827",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  locationCard: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  bottomBar: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  confirmButton: {
    backgroundColor: "#111827",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#9ca3af",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LocationPickerScreen;
