import React from 'react';
import { View, StyleSheet } from 'react-native';

export const HomeIcon = ({ focused, color }) => (
  <View style={styles.iconContainer}>
    <View style={styles.homeContainer}>
      {/* Roof - inverted V shape */}
      <View style={styles.roofContainer}>
        <View style={[styles.roofLine, { 
          backgroundColor: color,
          width: focused ? 2.5 : 2,
          height: 11,
          transform: [{ rotate: '-45deg' }, { translateX: 5 }]
        }]} />
        <View style={[styles.roofLine, { 
          backgroundColor: color,
          width: focused ? 2.5 : 2,
          height: 11,
          transform: [{ rotate: '45deg' }, { translateX: -5 }]
        }]} />
      </View>
      {/* House body - simple rectangle */}
      <View style={[styles.houseBody, { 
        borderColor: color,
        borderWidth: focused ? 2.5 : 2,
      }]} />
    </View>
  </View>
);

export const ServicesIcon = ({ focused, color }) => (
  <View style={styles.iconContainer}>
    <View style={styles.servicesGrid}>
      <View style={[styles.gridSquare, { 
        borderColor: color,
        borderWidth: focused ? 2.5 : 2
      }]} />
      <View style={[styles.gridSquare, { 
        borderColor: color,
        borderWidth: focused ? 2.5 : 2
      }]} />
      <View style={[styles.gridSquare, { 
        borderColor: color,
        borderWidth: focused ? 2.5 : 2
      }]} />
      <View style={[styles.gridSquare, { 
        borderColor: color,
        borderWidth: focused ? 2.5 : 2
      }]} />
    </View>
  </View>
);

export const ActivityIcon = ({ focused, color }) => (
  <View style={styles.iconContainer}>
    <View style={[styles.receiptContainer, { 
      borderColor: color,
      borderWidth: focused ? 2.5 : 2
    }]}>
      {/* Receipt lines */}
      <View style={[styles.receiptLine, { 
        backgroundColor: color,
        height: focused ? 2.5 : 2
      }]} />
      <View style={[styles.receiptLine, { 
        backgroundColor: color,
        height: focused ? 2.5 : 2
      }]} />
      <View style={[styles.receiptLine, { 
        backgroundColor: color,
        height: focused ? 2.5 : 2
      }]} />
    </View>
  </View>
);

export const AccountIcon = ({ focused, color }) => (
  <View style={styles.iconContainer}>
    <View style={styles.personWrapper}>
      {/* Head */}
      <View style={[styles.personHead, { 
        borderColor: color,
        borderWidth: focused ? 2.5 : 2
      }]} />
      {/* Body */}
      <View style={[styles.personBody, { 
        borderColor: color,
        borderWidth: focused ? 2.5 : 2
      }]} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  iconContainer: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Home Icon Styles
  homeContainer: {
    width: 22,
    height: 22,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  roofContainer: {
    flexDirection: 'row',
    width: 20,
    height: 10,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: -1,
  },
  roofLine: {
    position: 'absolute',
  },
  houseBody: {
    width: 14,
    height: 11,
    borderTopWidth: 0,
  },
  
  // Services Icon Styles
  servicesGrid: {
    width: 20,
    height: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  gridSquare: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  
  // Activity Icon Styles
  receiptContainer: {
    width: 18,
    height: 22,
    borderRadius: 3,
    paddingTop: 5,
    paddingHorizontal: 4,
  },
  receiptLine: {
    borderRadius: 1,
    marginBottom: 3,
  },
  
  // Account Icon Styles
  personWrapper: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  personHead: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginBottom: 1,
  },
  personBody: {
    width: 18,
    height: 11,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    borderBottomWidth: 0,
  },
});
