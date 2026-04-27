import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const BookingsScreen = () => {
  const bookings = [
    { id: 1, service: "Plumber", date: "Today, 3:00 PM", status: "Confirmed" },
    { id: 2, service: "Electrician", date: "Tomorrow, 10:00 AM", status: "Pending" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Bookings</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {bookings.map((booking) => (
          <View key={booking.id} style={styles.bookingCard}>
            <Text style={styles.serviceName}>{booking.service}</Text>
            <Text style={styles.date}>{booking.date}</Text>
            <View style={[
              styles.statusBadge,
              booking.status === "Confirmed" ? styles.confirmed : styles.pending
            ]}>
              <Text style={styles.statusText}>{booking.status}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 20,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 16,
  },
  bookingCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confirmed: {
    backgroundColor: "#4CAF50",
  },
  pending: {
    backgroundColor: "#FF9800",
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default BookingsScreen;
