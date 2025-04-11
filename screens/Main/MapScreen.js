import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

// Custom icons for POIs
import churchIcon from "../assets/icons/church.png";
import mosqueIcon from "../assets/icons/mosque.png";
import policeIcon from "../assets/icons/police.png";
import restaurantIcon from "../assets/icons/restaurant.png";

// Sample data
const poiData = [
  {
    id: 1,
    title: "Police Station",
    description: "Main Police Station",
    latitude: 6.5244,
    longitude: 3.3792,
    category: "Police",
  },
  {
    id: 2,
    title: "Church",
    description: "St. John's Church",
    latitude: 6.5245,
    longitude: 3.3795,
    category: "Church",
  },
  {
    id: 3,
    title: "Mosque",
    description: "Central Mosque",
    latitude: 6.5246,
    longitude: 3.3797,
    category: "Mosque",
  },
  {
    id: 4,
    title: "Restaurant",
    description: "Good Food Restaurant",
    latitude: 6.5238,
    longitude: 3.3788,
    category: "Eatery",
  },
  {
    id: 5,
    title: "Police Checkpoint",
    description: "Highway Checkpoint",
    latitude: 6.5252,
    longitude: 3.3801,
    category: "Police",
  },
];

// Utility functions
const getMarkerIcon = (category) => {
  const icons = {
    Police: policeIcon,
    Church: churchIcon,
    Mosque: mosqueIcon,
    Eatery: restaurantIcon,
  };
  return icons[category] || null;
};

const calculateDistance = (loc1, loc2) => {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371e3; // Earth radius in meters
  const dLat = toRad(loc2.latitude - loc1.latitude);
  const dLon = toRad(loc2.longitude - loc1.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(loc1.latitude)) *
      Math.cos(toRad(loc2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [alertTimers, setAlertTimers] = useState({});
  const [alternativeRoute, setAlternativeRoute] = useState(null);
  const [activeTab, setActiveTab] = useState("map");
  const mapRef = useRef(null);

  // Get police checkpoints
  const policeCheckpoints = poiData.filter((poi) => poi.category === "Police");
  const eateries = poiData.filter((poi) => poi.category === "Eatery");

  // Handle alert for nearby police checkpoints
  const handleCheckpointAlert = useCallback(
    (checkpoint) => {
      const now = Date.now();
      const lastAlertTime = alertTimers[checkpoint.id] || 0;
      const cooldownPeriod = 5 * 60 * 1000; // 5 minutes in milliseconds

      if (now - lastAlertTime > cooldownPeriod) {
        Alert.alert(
          "🚨 Police Checkpoint Nearby",
          `You're approaching ${checkpoint.title} (${checkpoint.description})`,
          [
            {
              text: "OK",
              style: "default",
            },
            {
              text: "Find Alternative Route",
              style: "destructive",
              onPress: () => findAlternativeRoute(checkpoint),
            },
          ]
        );
        setAlertTimers((prev) => ({ ...prev, [checkpoint.id]: now }));
      }
    },
    [alertTimers]
  );

  // Find alternative route around checkpoint
  const findAlternativeRoute = (checkpoint) => {
    if (!location) return;

    // This is a simplified version - in a real app you would use a routing service
    const alternativePath = [
      {
        latitude: location.latitude,
        longitude: location.longitude,
      },
      {
        latitude: checkpoint.latitude + 0.001,
        longitude: checkpoint.longitude + 0.001,
      },
      {
        latitude: checkpoint.latitude + 0.002,
        longitude: checkpoint.longitude - 0.001,
      },
    ];

    setAlternativeRoute(alternativePath);

    // Zoom to show the alternative route
    mapRef.current?.fitToCoordinates(alternativePath, {
      edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
      animated: true,
    });
  };

  // Watch user's location
  useEffect(() => {
    let subscription;

    const startWatching = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.warn("Permission to access location was denied");
          return;
        }

        // Get initial position
        const initialLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLocation(initialLocation.coords);

        // Watch for position changes
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 10, // Update every 10 meters
          },
          (newLocation) => {
            setLocation(newLocation.coords);
          }
        );
      } catch (error) {
        console.error("Error with location services:", error);
      }
    };

    startWatching();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  // Check for nearby police checkpoints
  useEffect(() => {
    if (!location) return;

    policeCheckpoints.forEach((checkpoint) => {
      const distance = calculateDistance(location, {
        latitude: checkpoint.latitude,
        longitude: checkpoint.longitude,
      });

      if (distance < 500) {
        // 500 meters
        handleCheckpointAlert(checkpoint);
      }
    });
  }, [location, handleCheckpointAlert, policeCheckpoints]);

  // Filter POIs based on selected category
  const filteredPOIs =
    selectedCategory === "All"
      ? poiData
      : poiData.filter((poi) => poi.category === selectedCategory);

  return (
    <View style={styles.container}>
      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {["All", "Police", "Church", "Mosque", "Eatery"].map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.filterButton,
              selectedCategory === category && styles.activeFilter,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={styles.filterButtonText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Map View */}
      {location ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
          followsUserLocation={true}
          showsCompass={true}
          toolbarEnabled={true}
        >
          {/* User's location marker */}
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Your Location"
            pinColor="#007AFF"
          />

          {/* POI Markers */}
          {filteredPOIs.map((poi) => (
            <Marker
              key={poi.id}
              coordinate={{
                latitude: poi.latitude,
                longitude: poi.longitude,
              }}
              title={poi.title}
              description={poi.description}
              image={getMarkerIcon(poi.category)}
            />
          ))}

          {/* Alternative route polyline */}
          {alternativeRoute && (
            <Polyline
              coordinates={alternativeRoute}
              strokeColor="#FF0000"
              strokeWidth={4}
              lineDashPattern={[10, 10]}
            />
          )}
        </MapView>
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loaderText}>Getting your location...</Text>
        </View>
      )}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.navButton, activeTab === "map" && styles.activeNavButton]}
          onPress={() => setActiveTab("map")}
        >
          <MaterialIcons
            name="map"
            size={24}
            color={activeTab === "map" ? "#007AFF" : "#666"}
          />
          <Text style={styles.navButtonText}>Map</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, activeTab === "eateries" && styles.activeNavButton]}
          onPress={() => setActiveTab("eateries")}
        >
          <MaterialIcons
            name="restaurant"
            size={24}
            color={activeTab === "eateries" ? "#007AFF" : "#666"}
          />
          <Text style={styles.navButtonText}>Eateries</Text>
        </TouchableOpacity>
      </View>

      {/* Eateries List (shown when tab is active) */}
      {activeTab === "eateries" && (
        <View style={styles.eateriesContainer}>
          <Text style={styles.sectionTitle}>Nearby Eateries</Text>
          {eateries.map((eatery) => (
            <View key={eatery.id} style={styles.eateryItem}>
              <MaterialIcons name="restaurant" size={20} color="#007AFF" />
              <View style={styles.eateryInfo}>
                <Text style={styles.eateryName}>{eatery.title}</Text>
                <Text style={styles.eateryDescription}>{eatery.description}</Text>
              </View>
              <TouchableOpacity
                style={styles.navigateButton}
                onPress={() => {
                  mapRef.current?.animateToRegion({
                    latitude: eatery.latitude,
                    longitude: eatery.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  });
                  setActiveTab("map");
                }}
              >
                <MaterialIcons name="directions" size={20} color="#007AFF" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    flex: 1,
  },
  filterContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20,
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    zIndex: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
    minWidth: 70,
    alignItems: "center",
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
  },
  activeFilter: {
    backgroundColor: "#007AFF",
  },
  activeFilterText: {
    color: "#fff",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loaderText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  navButton: {
    alignItems: "center",
    padding: 8,
    borderRadius: 10,
  },
  activeNavButton: {
    backgroundColor: "#f0f7ff",
  },
  navButtonText: {
    marginTop: 4,
    fontSize: 12,
    color: "#666",
  },
  eateriesContainer: {
    position: "absolute",
    bottom: 60,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: "40%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  eateryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  eateryInfo: {
    flex: 1,
    marginLeft: 10,
  },
  eateryName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  eateryDescription: {
    fontSize: 12,
    color: "#666",
  },
  navigateButton: {
    padding: 8,
  },
});

export default MapScreen;