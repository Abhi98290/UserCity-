import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

const ActivityScreen = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  const upcomingBookings = [
    { 
      id: 1, 
      service: "Plumber", 
      worker: "Rajesh Kumar",
      date: "Today", 
      time: "3:00 PM",
      status: "Confirmed",
      icon: "🔧",
      address: "123 Main Street, Jaipur"
    },
    { 
      id: 2, 
      service: "Electrician", 
      worker: "Amit Sharma",
      date: "Tomorrow", 
      time: "10:00 AM",
      status: "On the way",
      icon: "⚡",
      address: "456 Park Avenue, Jaipur"
    },
  ];

  const pastBookings = [
    { 
      id: 3, 
      service: "Cleaner", 
      worker: "Priya Singh",
      date: "Yesterday", 
      time: "2:00 PM",
      status: "Completed",
      icon: "🧹",
      address: "789 Lake Road, Jaipur"
    },
  ];

  const bookings = activeTab === "upcoming" ? upcomingBookings : pastBookings;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activity</Text>
        <Text style={styles.headerSubtitle}>Track your bookings</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === "upcoming" && styles.activeTab]}
          onPress={() => setActiveTab("upcoming")}
        >
          <Text style={[styles.tabText, activeTab === "upcoming" && styles.activeTabText]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === "past" && styles.activeTab]}
          onPress={() => setActiveTab("past")}
        >
          <Text style={[styles.tabText, activeTab === "past" && styles.activeTabText]}>
            Past
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {bookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>No bookings yet</Text>
            <Text style={styles.emptySubtext}>Book a service to get started</Text>
          </View>
        ) : (
          bookings.map((booking) => (
            <TouchableOpacity 
              key={booking.id} 
              style={styles.bookingCard}
              activeOpacity={0.7}
            >
              <View style={styles.bookingHeader}>
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>{booking.icon}</Text>
                </View>
                <View style={styles.bookingInfo}>
                  <Text style={styles.serviceName}>{booking.service}</Text>
                  <Text style={styles.workerName}>{booking.worker}</Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  booking.status === "Confirmed" && styles.confirmed,
                  booking.status === "On the way" && styles.onTheWay,
                  booking.status === "Completed" && styles.completed,
                ]}>
                  <Text style={styles.statusText}>{booking.status}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.bookingDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailIcon}>📅</Text>
                  <Text style={styles.detailText}>{booking.date}, {booking.time}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailIcon}>📍</Text>
                  <Text style={styles.detailText}>{booking.address}</Text>
                </View>
              </View>

              {activeTab === "upcoming" && (
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>View Details</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
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
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: -20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 4,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: "#000",
  },
  tabText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#8e8e93",
  },
  activeTabText: {
    color: "#fff",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  bookingCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  bookingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  bookingInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  workerName: {
    fontSize: 14,
    color: "#8e8e93",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  confirmed: {
    backgroundColor: "#34c759",
  },
  onTheWay: {
    backgroundColor: "#ff9500",
  },
  completed: {
    backgroundColor: "#8e8e93",
  },
  statusText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginBottom: 12,
  },
  bookingDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#000",
    flex: 1,
  },
  actionButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#8e8e93",
  },
});

export default ActivityScreen;
