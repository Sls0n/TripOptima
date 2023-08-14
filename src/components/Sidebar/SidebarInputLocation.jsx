import classes from './SidebarInputLocation.module.scss'
import { GeoapifyGeocoderAutocomplete } from '@geoapify/react-geocoder-autocomplete'
import { PencilSimple } from '@phosphor-icons/react'
import { useState, useEffect } from 'react'

import { useMap } from 'react-map-gl'
import mapboxgl from 'mapbox-gl'

import useLocationStore from '../../store/locationStore'
import useMarkerStore from '../../store/markerStore'
import SidebarInputLocationIcon from './SidebarInputLocationIcon'
import useSidebarStore from '../../store/sidebarStore'

const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY

const SidebarInputLocation = () => {
  const { map } = useMap()

  const marker = useMarkerStore((state) => state.marker)

  const setMarker = useMarkerStore((state) => state.setMarker)

  const [inputActivated, setInputActivated] = useState(false)

  const setCurrentLocation = useLocationStore(
    (state) => state.setCurrentLocation
  )
  const setDestinationLocation = useLocationStore(
    (state) => state.setDestinationLocation
  )

  const destinationAddress = useLocationStore(
    (state) => state.destinationAddress
  )

  const setDestinationAddress = useLocationStore(
    (state) => state.setDestinationAddress
  )

  const currentLocation = useLocationStore((state) => state.currentLocation)

  const destinationLocation = useLocationStore(
    (state) => state.destinationLocation
  )

  const travelMode = useLocationStore((state) => state.travelMode)

  const routeMode = useLocationStore((state) => state.routeMode)

  const avoidHighways = useLocationStore((state) => state.avoidHighways)

  const avoidTolls = useLocationStore((state) => state.avoidTolls)

  const setDistance = useLocationStore((state) => state.setDistance)

  const setDuration = useLocationStore((state) => state.setDuration)

  const setAlertMode = useLocationStore((state) => state.setAlertMode)

  const setSidebarMode = useSidebarStore((state) => state.setSidebarMode)

  const sourcePlaceSelect = (result) => {
    if (result) {
      const { lat, lon: lng } = result.properties
      setCurrentLocation([lng, lat])
    } else {
      console.error('Invalid result object:', result)
    }
  }

  const destinationPlaceSelect = (result) => {
    if (result) {
      const { lat, lon: lng } = result.properties
      setDestinationLocation([lng, lat])
      setDestinationAddress(result.properties.formatted)

      if (marker) {
        marker.remove()
      }

      const newMarker = new mapboxgl.Marker({})
        .setLngLat([lng, lat])
        .addTo(map.getMap())

      setMarker(newMarker)

      map.flyTo({
        center: [lng, lat],
        zoom: 14,
      })
    } else {
      console.error('Invalid result object:', result)
    }
  }

  useEffect(() => {
    if (currentLocation && destinationLocation) showRoute()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentLocation,
    destinationLocation,
    travelMode,
    routeMode,
    avoidTolls,
    avoidHighways,
  ])

  const xClickHandler = (e) => {
    e.preventDefault()
    setInputActivated(!inputActivated)
  }

  const showRoute = async () => {
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/routing?waypoints=${currentLocation[1]},${
          currentLocation[0]
        }|${destinationLocation[1]},${destinationLocation[0]}&mode=${
          travelMode.api
        }&apiKey=${GEOAPIFY_API_KEY}&type=${routeMode}${
          avoidHighways ? '&avoid=highways' : ''
        }${avoidTolls ? '&avoid=tolls' : ''}&distance&format=geojson`
      )
      const response_json = await fetch(
        `https://api.geoapify.com/v1/routing?waypoints=${currentLocation[1]},${
          currentLocation[0]
        }|${destinationLocation[1]},${destinationLocation[0]}&mode=${
          travelMode.api
        }&apiKey=${GEOAPIFY_API_KEY}&type=${routeMode}${
          avoidHighways ? '&avoid=highways' : ''
        }${avoidTolls ? '&avoid=tolls' : ''}&distance&format=json`
      )
      const data = await response.json()
      console.log(data)

      if (data.properties.waypoints[1].lon === 84.4404216) {
        console.log('You are potentially passing through a danger route')
        setAlertMode(true)
        setSidebarMode('Explore')
      }
      const data_json = await response_json.json()

      const distance = data_json.results[0].distance
      const distanceInKm = (distance / 1000).toFixed(2)

      const duration = data_json.results[0].time

      const hours = Math.floor(duration / 3600)
      const minutes = Math.floor((duration % 3600) / 60)

      let formattedDuration = ''

      if (hours > 0) {
        formattedDuration += `${hours}hr `
      }

      formattedDuration += `${minutes}min`

      setDistance(distanceInKm)
      setDuration(formattedDuration)

      if (!data) return

      if (map.getMap().getLayer('route')) {
        map.getMap().removeLayer('route')
      }

      if (map.getMap().getSource('route')) {
        map.getMap().removeSource('route')
      }

      map.getMap().addSource('route', {
        type: 'geojson',
        data: data,
      })

      map.getMap().addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#0074D9',
          'line-opacity': 0.7,
          'line-width': 7,
        },
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className={classes['sidebar__input-location']}>
      <label htmlFor="location">Location</label>

      <form className={classes['sidebar__input-container']}>
        <SidebarInputLocationIcon />
        {inputActivated ? (
          <GeoapifyGeocoderAutocomplete
            placeholder="From"
            filterByCountryCode={['np']}
            placeSelect={sourcePlaceSelect}
          />
        ) : (
          <>
            <div className={classes['currentLocation']}>
              <span>Your location</span>
              {/* <button onClick={xClickHandler} className={classes['x']}>
                <PencilSimple
                  size={20}
                  color="rgba(0, 0, 0, 0.5)"
                  className={classes['icon']}
                />
              </button> */}
            </div>
          </>
        )}

        <GeoapifyGeocoderAutocomplete
          placeholder="Type destination or click on map"
          placeSelect={destinationPlaceSelect}
          filterByCountryCode={['np']}
          value={destinationAddress}
        />
      </form>
    </div>
  )
}

export default SidebarInputLocation
