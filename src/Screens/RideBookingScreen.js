import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView, Platform, StatusBar } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

const RideBookingScreen = ({ route, navigation }) => {
  const { service = {}, pickup, drop } = route.params || {};
  const [pickupLocation, setPickupLocation] = useState(pickup?.address || "");
  const [dropLocation, setDropLocation] = useState(drop?.address || "");
  const [pickupCoords, setPickupCoords] = useState(pickup || null);
  const [dropCoords, setDropCoords] = useState(drop || null);

  // Update locations when params change
  React.useEffect(() => {
    if (route.params?.pickup) {
      setPickupLocation(route.params.pickup.address);
      setPickupCoords(route.params.pickup);
    }
    if (route.params?.drop) {
      setDropLocation(route.params.drop.address);
      setDropCoords(route.params.drop);
    }
  }, [route.params]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{service?.title || "Book Ride"}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Service Info */}
        <View style={styles.serviceCard}>
          <Image source={service?.icon} style={styles.serviceIcon} resizeMode="contain" />
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>{service?.title || "Service"}</Text>
            <Text style={styles.serviceSubtitle}>{service?.subtitle || "Book your ride"}</Text>
          </View>
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>{service?.fare || "₹0"}</Text>
          </View>
        </View>

        {/* Location Inputs */}
        <View style={styles.locationSection}>
          <Text style={styles.sectionTitle}>Trip Details</Text>
          
          {/* Pickup Location */}
          <TouchableOpacity 
            style={styles.inputContainer}
            onPress={() => navigation.navigate('LocationPicker', { 
              locationType: 'pickup',
              returnScreen: 'RideBooking'
            })}
          >
            <View style={[styles.locationDot, { backgroundColor: "#10b981" }]} />
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Pickup Location</Text>
              <Text style={[styles.input, styles.inputText]}>
                {pickupLocation || "Tap to select pickup location"}
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          {/* Connecting Line */}
          <View style={styles.lineWrapper}>
            <View style={styles.connectingLine} />
          </View>

          {/* Drop Location */}
          <TouchableOpacity 
            style={styles.inputContainer}
            onPress={() => navigation.navigate('LocationPicker', { 
              locationType: 'drop',
              returnScreen: 'RideBooking'
            })}
          >
            <View style={[styles.locationDot, { backgroundColor: "#ef4444" }]} />
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Drop Location</Text>
              <Text style={[styles.input, styles.inputText]}>
                {dropLocation || "Tap to select drop location"}
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Quick Suggestions */}
        <View style={styles.suggestionsSection}>
          <Text style={styles.sectionTitle}>Quick Picks</Text>
          <View style={styles.suggestionRow}>
            <TouchableOpacity style={styles.suggestionChip}>
              <Text style={styles.suggestionText}>🏠 Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.suggestionChip}>
              <Text style={styles.suggestionText}>💼 Work</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.suggestionChip}>
              <Text style={styles.suggestionText}>📍 Saved</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Trip Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Estimated Time</Text>
            <Text style={styles.infoValue}>{service?.eta || "N/A"}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Base Fare</Text>
            <Text style={styles.infoValue}>{service?.fare || "₹0"}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={[styles.confirmButton, (!pickupCoords || !dropCoords) && styles.disabledButton]}
          disabled={!pickupCoords || !dropCoords}
          onPress={() => {
            console.log("Booking confirmed", { 
              pickup: pickupCoords, 
              drop: dropCoords, 
              service 
            });
            navigation.goBack();
          }}
        >
          <Text style={styles.confirmButtonText}>Confirm Booking</Text>
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
    paddingVertical: 8,
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  placeholder: {
    width: 40,
  },
  content: {
    padding: 16,
  },
  serviceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  serviceIcon: {
    width: 50,
    height: 50,
    marginRight: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  serviceSubtitle: {
    fontSize: 13,
    color: "#6b7280",
  },
  priceTag: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  priceText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  locationSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  lineWrapper: {
    paddingLeft: 5,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  inputWrapper: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 4,
  },
  input: {
    fontSize: 15,
    color: "#111827",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  inputText: {
    color: "#111827",
  },
  connectingLine: {
    width: 2,
    height: 24,
    backgroundColor: "#d1d5db",
    // marginLeft: 5,
    marginVertical: 0,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  suggestionsSection: {
    marginBottom: 16,
  },
  suggestionRow: {
    flexDirection: "row",
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  suggestionText: {
    fontSize: 14,
    color: "#374151",
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 12,
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

export default RideBookingScreen;
