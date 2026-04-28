import React from "react";
import { View, Text, StyleSheet } from "react-native";

const BookingsScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookings</Text>
        <Text style={styles.headerSubtitle}>Manage your bookings</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.emptyIcon}>📅</Text>
        <Text style={styles.emptyText}>Coming Soon</Text>
        <Text style={styles.emptySubtext}>Booking management feature will be available soon</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  header: {
    backgroundColor: "#000",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#b0b0b0",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#8e8e93",
    textAlign: "center",
  },
});

export default BookingsScreen;
