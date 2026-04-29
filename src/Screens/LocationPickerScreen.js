import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Keyboard, TextInput, FlatList, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Icon from 'react-native-vector-icons/Ionicons';

const GOOGLE_API_KEY = 'AIzaSyAJ8mnmfeiGdK_JmnlcvwznLuQs57OjnhA';

const LocationPickerScreen = ({ route, navigation }) => {
  const { locationType, userLocation } = route.params; // 'pickup' or 'drop' and userLocation from HomeScreen
  const mapRef = useRef(null);
  
  // Use user location from params if available, otherwise default to Jaipur
  const initialLocation = userLocation || {
    latitude: 26.9124,
    longitude: 75.7873,
  };
  
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [address, setAddress] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef(null);

  // Center map to initial location when component mounts
  useEffect(() => {
    if (mapRef.current && initialLocation) {
      setTimeout(() => {
        mapRef.current?.animateToRegion({
          ...initialLocation,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, 500);
      }, 500);
    }
  }, []);

  const searchPlaces = async (text) => {
    if (text.length < 2) {
      setPredictions([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(text)}&key=${GOOGLE_API_KEY}&components=country:in&location=${selectedLocation.latitude},${selectedLocation.longitude}&radius=50000`
      );
      const data = await response.json();
      
      console.log('🔍 Search results:', data);
      
      if (data.predictions) {
        setPredictions(data.predictions);
      } else {
        console.log('❌ Error:', data.error_message || 'No predictions');
        setPredictions([]);
      }
    } catch (error) {
      console.log('❌ Search error:', error);
      setPredictions([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    searchTimeout.current = setTimeout(() => {
      searchPlaces(text);
    }, 400);
  };

  const getPlaceDetails = async (placeId) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}&fields=geometry,formatted_address`
      );
      const data = await response.json();
      
      console.log('📍 Place details:', data);
      
      if (data.result) {
        const { lat, lng } = data.result.geometry.location;
        const newLocation = {
          latitude: lat,
          longitude: lng,
        };
        setSelectedLocation(newLocation);
        setAddress(data.result.formatted_address);
        setPredictions([]);
        setSearchQuery(data.result.formatted_address);
        
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
    } catch (error) {
      console.log('❌ Place details error:', error);
    }
  };

  const handlePredictionPress = (prediction) => {
    getPlaceDetails(prediction.place_id);
  };

  const handleMapPress = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
    
    // Reverse geocoding to get address from coordinates
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const formattedAddress = data.results[0].formatted_address;
        setAddress(formattedAddress);
        setSearchQuery(formattedAddress);
      } else {
        setAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        setSearchQuery(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      }
    } catch (error) {
      console.log('❌ Reverse geocoding error:', error);
      setAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      setSearchQuery(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
    }
  };

  const handleConfirm = () => {
    // Get existing params to preserve them
    const existingParams = route.params.existingParams || {};
    
    navigation.navigate({
      name: route.params.returnScreen,
      params: {
        ...existingParams,
        [locationType]: {
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          address: address || "Selected Location",
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

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Icon name="search" size={20} color="#6b7280" style={styles.searchIcon} />
          <TextInput
            value={searchQuery}
            onChangeText={handleSearchChange}
            placeholder="Search location"
            placeholderTextColor="#9ca3af"
            style={styles.searchInput}
          />
          {isSearching && (
            <ActivityIndicator size="small" color="#6b7280" style={styles.loadingIcon} />
          )}
        </View>
        
        {predictions.length > 0 && (
          <FlatList
            data={predictions}
            keyExtractor={(item) => item.place_id}
            style={styles.predictionsList}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.predictionItem}
                onPress={() => handlePredictionPress(item)}
              >
                <Icon name="location-outline" size={20} color="#6b7280" />
                <View style={styles.predictionTextContainer}>
                  <Text style={styles.predictionMainText}>
                    {item.structured_formatting.main_text}
                  </Text>
                  <Text style={styles.predictionSecondaryText}>
                    {item.structured_formatting.secondary_text}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
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
    zIndex: 10,
    elevation: 5,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 15,
    color: "#111827",
  },
  loadingIcon: {
    marginLeft: 8,
  },
  predictionsList: {
    maxHeight: 300,
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  predictionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  predictionTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  predictionMainText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  predictionSecondaryText: {
    fontSize: 12,
    color: "#6b7280",
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
