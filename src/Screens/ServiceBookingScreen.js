import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, SafeAreaView, Platform, StatusBar } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

const ServiceBookingScreen = ({ route, navigation }) => {
  const { service } = route.params;
  const [address, setAddress] = useState("");
  const [selectedDate, setSelectedDate] = useState("Today");
  const [selectedTime, setSelectedTime] = useState("Morning");

  const dates = ["Today", "Tomorrow", "Day After"];
  const times = ["Morning", "Afternoon", "Evening"];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Service</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Service Info */}
        <View style={styles.serviceCard}>
          <Image source={service.icon} style={styles.serviceIcon} resizeMode="contain" />
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>{service.title}</Text>
            <Text style={styles.serviceSubtitle}>{service.subtitle}</Text>
          </View>
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>{service.fare}</Text>
          </View>
        </View>

        {/* Address Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Location</Text>
          <TextInput
            value={address}
            onChangeText={setAddress}
            placeholder="Enter your address"
            placeholderTextColor="#9ca3af"
            style={styles.addressInput}
            multiline
          />
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <View style={styles.optionsRow}>
            {dates.map((date) => (
              <TouchableOpacity
                key={date}
                style={[styles.optionChip, selectedDate === date && styles.selectedChip]}
                onPress={() => setSelectedDate(date)}
              >
                <Text style={[styles.optionText, selectedDate === date && styles.selectedText]}>
                  {date}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Time Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferred Time</Text>
          <View style={styles.optionsRow}>
            {times.map((time) => (
              <TouchableOpacity
                key={time}
                style={[styles.optionChip, selectedTime === time && styles.selectedChip]}
                onPress={() => setSelectedTime(time)}
              >
                <Text style={[styles.optionText, selectedTime === time && styles.selectedText]}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Service</Text>
            <Text style={styles.summaryValue}>{service.title}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Date</Text>
            <Text style={styles.summaryValue}>{selectedDate}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Time</Text>
            <Text style={styles.summaryValue}>{selectedTime}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotal}>Total</Text>
            <Text style={styles.summaryTotal}>{service.fare}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={[styles.confirmButton, !address && styles.disabledButton]}
          disabled={!address}
          onPress={() => {
            console.log("Service booked", { address, selectedDate, selectedTime, service });
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
  section: {
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
    marginBottom: 12,
  },
  addressInput: {
    fontSize: 15,
    color: "#111827",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: "top",
  },
  optionsRow: {
    flexDirection: "row",
    gap: 8,
  },
  optionChip: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedChip: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },
  optionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  selectedText: {
    color: "#fff",
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 12,
  },
  summaryTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
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

export default ServiceBookingScreen;
