import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

const ProfileScreen = () => {
  const menuSections = [
    {
      title: "Account",
      items: [
        { id: 1, title: "Edit Profile", icon: "👤", subtitle: "Name, phone, email" },
        { id: 2, title: "Addresses", icon: "📍", subtitle: "Manage saved addresses" },
        { id: 3, title: "Payment Methods", icon: "💳", subtitle: "Cards, UPI, wallets" },
      ]
    },
    {
      title: "Preferences",
      items: [
        { id: 4, title: "Notifications", icon: "🔔", subtitle: "Push, email, SMS" },
        { id: 5, title: "Language", icon: "🌐", subtitle: "English" },
        { id: 6, title: "Privacy", icon: "🔒", subtitle: "Data & permissions" },
      ]
    },
    {
      title: "Support",
      items: [
        { id: 7, title: "Help Center", icon: "❓", subtitle: "FAQs & support" },
        { id: 8, title: "Safety", icon: "🛡️", subtitle: "Emergency contacts" },
        { id: 9, title: "About", icon: "ℹ️", subtitle: "Version 1.0.0" },
      ]
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AK</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>Abhishek Kumar</Text>
            <Text style={styles.phone}>+91 98765 43210</Text>
            <TouchableOpacity style={styles.ratingContainer}>
              <Text style={styles.star}>⭐</Text>
              <Text style={styles.rating}>4.8</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.menuContainer}
        showsVerticalScrollIndicator={false}
      >
        {menuSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, index) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={[
                    styles.menuItem,
                    index !== section.items.length - 1 && styles.menuItemBorder
                  ]}
                  activeOpacity={0.7}
                  onPress={() => console.log(`${item.title} pressed`)}
                >
                  <View style={styles.menuLeft}>
                    <View style={styles.menuIconContainer}>
                      <Text style={styles.menuIcon}>{item.icon}</Text>
                    </View>
                    <View style={styles.menuTextContainer}>
                      <Text style={styles.menuTitle}>{item.title}</Text>
                      <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                    </View>
                  </View>
                  <Text style={styles.arrow}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>UserCity v1.0.0</Text>
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
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    color: "#b0b0b0",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  star: {
    fontSize: 14,
    marginRight: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  menuContainer: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8e8e93",
    marginBottom: 8,
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  menuIcon: {
    fontSize: 20,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: "#8e8e93",
  },
  arrow: {
    fontSize: 24,
    color: "#c7c7cc",
    marginLeft: 8,
  },
  logoutButton: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ff3b30",
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    color: "#8e8e93",
    marginBottom: 30,
  },
});

export default ProfileScreen;
