import classes from './SidebarInputLocation.module.scss'
import { GeoapifyGeocoderAutocomplete } from '@geoapify/react-geocoder-autocomplete'
import { PencilSimple } from '@phosphor-icons/react'
import { useState } from 'react'

import { useMap } from 'react-map-gl'
import mapboxgl from 'mapbox-gl'

import useLocationStore from '../../store/locationStore'
import useMarkerStore from '../../store/markerStore'
import SidebarInputLocationIcon from './SidebarInputLocationIcon'

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

  const xClickHandler = (e) => {
    e.preventDefault()
    setInputActivated(!inputActivated)
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
              <button onClick={xClickHandler} className={classes['x']}>
                <PencilSimple
                  size={20}
                  color="rgba(0, 0, 0, 0.5)"
                  className={classes['icon']}
                />
              </button>
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