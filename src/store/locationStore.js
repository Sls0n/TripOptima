import { create } from 'zustand'

const useLocationStore = create((set) => ({
  currentLocation: null,
  setCurrentLocation: (location) => set({ currentLocation: location }),

  desinationLocation: null,
  setDestinationLocation: (location) => set({ destinationLocation: location }),

  destinationAddress: null,
  setDestinationAddress: (address) => set({ destinationAddress: address }),

  travelMode: { api: 'drive', label: 'Drive' },
  setTravelMode: (mode) => set({ travelMode: mode }),

  distance: null,
  setDistance: (distance) => set({ distance: distance }),

  duration: null,
  setDuration: (duration) => set({ duration: duration }),

  routeMode: 'balanced',
  setRouteMode: (routeMode) => set({ routeMode: routeMode }),

  avoidTolls: false,
  setAvoidTolls: (avoidTolls) => set({ avoidTolls: avoidTolls }),

  avoidHighways: false,
  setAvoidHighways: (avoidHighways) => set({ avoidHighways: avoidHighways }),

  disruptiveWeather: false,
  setDisruptiveWeather: (disruptiveWeather) =>
    set({ disruptiveWeather: disruptiveWeather }),
}))

export default useLocationStore
