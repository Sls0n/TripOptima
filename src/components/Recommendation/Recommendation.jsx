import classes from './Recommendation.module.scss'
import { Star } from '@phosphor-icons/react'

import { useState } from 'react'
import { useMap } from 'react-map-gl'
import mapboxgl from 'mapbox-gl'

import useLocationStore from '../../store/locationStore'
import useMarkerStore from '../../store/markerStore'
import useSidebarStore from '../../store/sidebarStore'

const Recommendation = () => {
  const [json, setJson] = useState([
    {
      name: 'Kathmandu Durbar Square',
      latitude: 27.7042737,
      longitude: 85.307463,
      ratings: 4.5,
      no_of_reviews: 29680,
      category: 'Plaza',
      description: 'Historic royal complex with a courtyard',
      small_photo:
        'https://lh5.googleusercontent.com/p/AF1QipPyv3d7WtU3tX7DIwlTT_n2qqNEfDoo2vDE2-KH=w1200-h1200-k-no',
    },
    {
      name: 'Swoyambhu Mahachaitya',
      latitude: 27.7148996,
      longitude: 85.2903957,
      ratings: 4.6,
      no_of_reviews: 14675,
      category: 'Tourist attraction',
      description: '·',
      small_photo:
        'https://lh5.googleusercontent.com/p/AF1QipPdB4bluHLwD7FFk4g4nY2RdDbFCc0mgxs4Ee09=w1200-h1200-k-no',
    },
    {
      name: 'Garden of Dreams',
      latitude: 27.7141261,
      longitude: 85.3145041,
      ratings: 4.2,
      no_of_reviews: 10669,
      category: 'Tourist attraction',
      description: '·',
      small_photo:
        'https://lh5.googleusercontent.com/p/AF1QipPBQjQmlecutMBTHp79DveB63fizSCwpKQ9P0rd=w1200-h1200-k-no',
    },
    {
      name: 'Patan Darbar Square',
      latitude: 27.6726981,
      longitude: 85.3253211,
      ratings: 4.6,
      no_of_reviews: 25690,
      category: 'Tourist attraction',
      description: 'Collection of Hindu & Buddhist sculpture',
      small_photo:
        'https://lh5.googleusercontent.com/p/AF1QipNcHvhs0kjQCizhzL_DZuni04eQOrYPqGEzP2mS=w1200-h1200-k-no',
    },
    {
      name: 'Hanuman Dhoka',
      latitude: 27.704272,
      longitude: 85.307417,
      ratings: 4.5,
      no_of_reviews: 950,
      category: 'Tourist attraction',
      description: '·',
      small_photo:
        'https://lh5.googleusercontent.com/p/AF1QipMBqjTVXVqcMCap8PWWqV0WvD_RE7-eOGvHvT4b=w1200-h1200-k-no',
    },
    {
      name: 'Buddha Stupa',
      latitude: 27.7214694,
      longitude: 85.362035,
      ratings: 4.7,
      no_of_reviews: 13129,
      category: 'Tourist attraction',
      description: 'Huge, dome-topped Buddhist temple',
      small_photo:
        'https://lh5.googleusercontent.com/p/AF1QipNlESw14fp4CMcfzEFMHdY-dyg8vrm_PumhDcHq=w1200-h1200-k-no',
    },
    {
      name: 'Kathmandu Valley',
      latitude: 27.6666667,
      longitude: 85.35,
      ratings: 4.4,
      no_of_reviews: 508,
      category: 'Ravine',
      description: 'Famed area with 130+ historic monuments',
      small_photo:
        'https://lh5.googleusercontent.com/p/AF1QipPYrpjpKAK_HVERTzbSe2DHPIEHPThnu570aYWx=w1200-h1200-k-no',
    },
    {
      name: 'Narayanhiti Palace Museum',
      latitude: 27.7149634,
      longitude: 85.3183285,
      ratings: 4.4,
      no_of_reviews: 4282,
      category: 'Historical place museum',
      description: '·',
      small_photo:
        'https://lh5.googleusercontent.com/p/AF1QipMVuoHCIQaVTgzVSMBPiAuAyQ2qyo1COMTQnEZk=w1200-h1200-k-no',
    },
    {
      name: 'Kopan Monastery',
      latitude: 27.7426594,
      longitude: 85.3649135,
      ratings: 4.4,
      no_of_reviews: 1108,
      category: 'Research institute',
      description: '·',
      small_photo:
        'https://lh5.googleusercontent.com/p/AF1QipPOhWMv2kqjZ_JjL5nS_9G6x8aEltlMyNn64nUL=w1200-h1200-k-no',
    },
  ])

  const { map } = useMap()

  const { marker, setMarker } = useMarkerStore()

  const { setSidebarMode } = useSidebarStore()

  const { setDestinationLocation, setDestinationAddress } = useLocationStore()

  const destinationPlaceSelect = (lat, lng, destination) => {
    setDestinationLocation([lng, lat])
    setDestinationAddress(destination)

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

    setSidebarMode('Location')
  }

  return (
    <div className={classes.recommendation}>
      <div className={classes.heading}>Some suggestions:</div>
      <div className={classes.recommendation__container}>
        {json.map((item, index) => {
          return (
            <div
              role="button"
              tabIndex={1}
              className={classes.recommendation__card}
              key={index}
              onClick={() => {
                destinationPlaceSelect(item.latitude, item.longitude, item.name)
              }}
            >
              <div className={classes.recommendation__img}>
                <img src={item.small_photo} alt={item.name} />
              </div>

              <div className={classes.recommendation__info}>
                <h3>{item.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Star
                    size={16}
                    style={{
                      marginLeft: '0.5rem',
                      marginRight: '0.5rem',
                    }}
                  />
                  <p>{item.ratings}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Recommendation
