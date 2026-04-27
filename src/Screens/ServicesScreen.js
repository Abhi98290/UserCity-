import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

const ServicesScreen = () => {
  const services = [
    { id: 1, name: "Plumber", icon: "🔧" },
    { id: 2, name: "Electrician", icon: "⚡" },
    { id: 3, name: "Carpenter", icon: "🪚" },
    { id: 4, name: "Painter", icon: "🎨" },
    { id: 5, name: "Cleaner", icon: "🧹" },
    { id: 6, name: "AC Repair", icon: "❄️" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available Services</Text>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {services.map((service) => (
          <TouchableOpacity 
            key={service.id} 
            style={styles.serviceCard}
            onPress={() => console.log(`${service.name} selected`)}
          >
            <Text style={styles.icon}>{service.icon}</Text>
            <Text style={styles.serviceName}>{service.name}</Text>
          </TouchableOpacity>
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
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  serviceCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  icon: {
    fontSize: 40,
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});

export default ServicesScreen;
