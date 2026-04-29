import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ServiceModal = ({ visible, onClose, service, onBook, userLocation }) => {
  const navigation = useNavigation();
  
  if (!service) return null;

  const handleBookNow = () => {
    onClose();
    
    // Navigate based on service type
    if (service.key === 'taxi' || service.key === 'porter') {
      navigation.navigate('RideBooking', { service, userLocation });
    } else {
      navigation.navigate('ServiceBooking', { service });
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.serviceModal}>
          <TouchableOpacity 
            style={styles.modalHandleTouch} 
            onPress={onClose}
          >
            <View style={styles.modalHandle} />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
            <View style={styles.modalHeader}>
              <Image 
                source={service.icon} 
                style={styles.modalServiceIcon} 
                resizeMode="contain" 
              />
              <Text style={styles.modalTitle}>{service.title}</Text>
              <Text style={styles.modalSubtitle}>{service.subtitle}</Text>
            </View>

            <View style={styles.modalInfoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Estimated Time</Text>
                <Text style={styles.infoValue}>{service.eta}</Text>
              </View>
              <View style={styles.infoDivider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Starting Price</Text>
                <Text style={styles.infoValue}>{service.fare}</Text>
              </View>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.sectionTitle}>What's Included</Text>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>✓</Text>
                <Text style={styles.featureText}>Professional service provider</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>✓</Text>
                <Text style={styles.featureText}>Quality guaranteed</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>✓</Text>
                <Text style={styles.featureText}>Secure payment</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>✓</Text>
                <Text style={styles.featureText}>24/7 customer support</Text>
              </View>
            </View>
          </ScrollView>

          {/* Fixed Bottom Button */}
          <View style={styles.bottomButtonContainer}>
            <TouchableOpacity 
              style={styles.bookNowButton}
              onPress={handleBookNow}
            >
              <Text style={styles.bookNowText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    flex: 1,
  },
  serviceModal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%",
  },
  modalHandleTouch: {
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  modalHandle: {
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#cbd5e1",
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  modalHeader: {
    alignItems: "center",
    paddingVertical: 20,
  },
  modalServiceIcon: {
    width: 60,
    height: 60,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  modalInfoCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
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
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  infoDivider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 12,
  },
  modalSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 18,
    color: "#10b981",
    marginRight: 12,
    fontWeight: "bold",
  },
  featureText: {
    fontSize: 15,
    color: "#374151",
  },
  bottomButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  bookNowButton: {
    backgroundColor: "#111827",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  bookNowText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ServiceModal;
