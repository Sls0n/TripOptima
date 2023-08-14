import { useEffect, useRef, useState } from 'react'
import MapGL, { useMap } from 'react-map-gl'
import mapboxgl from 'mapbox-gl'

import classes from './Map.module.scss'
import MapButtons from './MapButtons'

import useLocationStore from '../../store/locationStore'
import useMarkerStore from '../../store/markerStore'
import useMapStore from '../../store/mapStore'
import useRushStore from '../../store/rushStore'
import MapInfo from './MapInfo'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY

const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY

const MapLayout = () => {
  const mapRef = useRef(null)
  const { map } = useMap()
  const [lnglat, setLngLat] = useState(null)
  const setCurrentLocation = useLocationStore(
    (state) => state.setCurrentLocation
  )

  const {
    currentLocation,
    setDestinationLocation,
    setDestinationAddress,
    travelMode,
  } = useLocationStore()

  const { setMarker, marker } = useMarkerStore()

  const { mapStyle } = useMapStore()

  const { rushMode, rushRadius, rushParams } = useRushStore()

  useEffect(() => {
    navigator.geolocation.watchPosition((success) => {
      const { latitude, longitude } = success.coords
      setLngLat([longitude, latitude])
      setCurrentLocation([longitude, latitude])
    }),
      (error) => {
        console.log(error)
        alert('Please allow location access')
      }
  }, [setCurrentLocation])

  useEffect(() => {
    if (rushMode) {
      map.flyTo({
        center: [currentLocation[0], currentLocation[1]],
        zoom: 16,
        curve: 2,
        speed: 1.2,
      })
      fetch(
        `https://api.geoapify.com/v2/places?categories=${rushParams}&filter=circle:${currentLocation[0]},${currentLocation[1]},${rushRadius}&bias=proximity:${currentLocation[0]},${currentLocation[1]}&limit=20&apiKey=${GEOAPIFY_API_KEY}`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          data.features.forEach((feature) => {
            const { lat, lon } = feature.properties
            const newMarker = new mapboxgl.Marker({
              color: '#333',
            })
              .setLngLat([lon, lat])
              .addTo(mapRef.current.getMap())
            // add popup
            newMarker.setPopup(
              new mapboxgl.Popup().setHTML(
                `<h3>${feature.properties.name}</h3><p>${feature.properties.formatted}</p>`
              )
            )
          })
        })
        .catch((err) => console.log(err))

      fetch(
        `https://api.geoapify.com/v1/isoline?lat=${currentLocation[1]}&lon=${currentLocation[0]}&type=distance&mode=${travelMode.api}&range=${rushRadius}&apiKey=${GEOAPIFY_API_KEY}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (mapRef?.current?.getMap().getLayer('isoline-line')) {
            mapRef?.current?.getMap().removeLayer('isoline-line')
          }
          if (mapRef?.current?.getMap().getLayer('isoline-fill')) {
            mapRef?.current?.getMap().removeLayer('isoline-fill')
          }
          if (mapRef?.current?.getMap().getSource('isoline-data-source')) {
            mapRef?.current?.getMap().removeSource('isoline-data-source')
          }
          mapRef?.current.getMap().addSource('isoline-data-source', {
            type: 'geojson',
            data: data,
          })
          mapRef?.current.getMap().addLayer({
            id: 'isoline-line',
            type: 'line',
            source: 'isoline-data-source',
            paint: {
              'line-color': '#6666ff',
              'line-width': 2,
            },
          })
          mapRef?.current.getMap().addLayer({
            id: `isoline-fill`,
            type: 'fill',
            source: 'isoline-data-source',
            paint: {
              'fill-color': '#6666ff',
              'fill-opacity': 0.3,
            },
          })
        })
        .catch((err) => console.log(err))
    }
  }, [rushMode, rushRadius, rushParams, currentLocation, travelMode])

  return (
    <div className={classes.map}>
      {lnglat && (
        <MapGL
          id="map"
          style={{
            borderRadius: '2rem',
          }}
          projection={'globe'}
          ref={mapRef}
          initialViewState={{
            longitude: lnglat[0],
            latitude: lnglat[1],
            zoom: 2,
          }}
          mapStyle={mapStyle}
          mapboxAccessToken={mapboxgl.accessToken}
          onLoad={(e) => {
            const geolocate = new mapboxgl.GeolocateControl({
              positionOptions: {
                enableHighAccuracy: true,
              },
              trackUserLocation: true,
              showUserHeading: true,
              showAccuracyCircle: false,
              showUserLocation: true,
            })

            e.target.addControl(geolocate, 'top-left')

            setTimeout(() => {
              geolocate.trigger()
            }, 1000)
          }}
          onClick={(e) => {
            const { lng, lat } = e.lngLat
            console.log(lng, lat)
            setDestinationLocation([lng, lat])
            // reverse geocoding through clicked coordinates
            fetch(
              `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${GEOAPIFY_API_KEY}`
            )
              .then((res) => res.json())
              .then((data) => {
                setDestinationAddress(data.features[0].properties.formatted)
              })
              .catch((err) => console.log(err))
            if (marker) {
              marker.remove()
            }

            const newMarker = new mapboxgl.Marker({})
              .setLngLat([lng, lat])
              .addTo(mapRef.current.getMap())

            setMarker(newMarker)
          }}
        >
          <MapButtons />
          <MapInfo />
        </MapGL>
      )}
    </div>
  )
}

export default MapLayout
