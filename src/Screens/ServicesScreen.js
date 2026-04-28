import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from "react-native";

const ServicesScreen = () => {
  const [searchText, setSearchText] = useState("");

  const services = [
    { id: 1, name: "Plumber", icon: require("../assets/Plumber.png"), desc: "Pipe repair, installation", price: "₹149" },
    { id: 2, name: "Electrician", icon: require("../assets/Electrician.png"), desc: "Wiring, appliance repair", price: "₹199" },
    { id: 3, name: "Carpenter", icon: require("../assets/carpenter.png"), desc: "Furniture, door repair", price: "₹249" },
    { id: 4, name: "Painter", icon: require("../assets/roller.png"), desc: "Wall painting, touch-up", price: "₹299" },
    { id: 5, name: "Cleaner", icon: require("../assets/Cleaner.png"), desc: "Deep cleaning, sanitize", price: "₹399" },
    { id: 6, name: "AC Repair", icon: require("../assets/AC Repair.png"), desc: "Service, gas refill", price: "₹499" },
    { id: 7, name: "Pest Control", icon: require("../assets/pest-control.png"), desc: "Termite, cockroach", price: "₹599" },
    { id: 8, name: "Appliance", icon: require("../assets/household-appliance.png"), desc: "Washing machine, fridge", price: "₹349" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Services</Text>
        <Text style={styles.headerSubtitle}>Book trusted professionals</Text>
      </View>

      <View style={styles.searchContainer}>
        <Image source={require("../assets/Search.png")} style={styles.searchIconImage} resizeMode="contain" />
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search for services"
          placeholderTextColor="#8e8e93"
          style={styles.searchInput}
        />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Popular Services</Text>
        
        {services.map((service) => (
          <TouchableOpacity 
            key={service.id} 
            style={styles.serviceCard}
            activeOpacity={0.7}
            onPress={() => console.log(`${service.name} selected`)}
          >
            <View style={styles.serviceLeft}>
              <View style={styles.iconContainer}>
                <Image source={service.icon} style={styles.iconImage} resizeMode="contain" />
              </View>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDesc}>{service.desc}</Text>
              </View>
            </View>
            <View style={styles.serviceRight}>
              <Text style={styles.servicePrice}>{service.price}</Text>
              <Text style={styles.arrow}>›</Text>
            </View>
          </TouchableOpacity>
        ))}
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: -20,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  searchIconImage: {
    width: 30,
    height: 30,
    marginRight: 10,
    tintColor: "#8e8e93",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 16,
  },
  serviceCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  serviceLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  iconImage: {
    width: 28,
    height: 28,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  serviceDesc: {
    fontSize: 13,
    color: "#8e8e93",
  },
  serviceRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginRight: 8,
  },
  arrow: {
    fontSize: 24,
    color: "#c7c7cc",
  },
});

export default ServicesScreen;
