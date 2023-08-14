import classes from './ShowNearby.module.scss'

import RadiusInput from './RadiusInput'
import Select from 'react-select'
import useRushStore from '../../store/rushStore'

const ShowNearby = () => {
  const { setRushRadius, radius, setRadius, setRushParams, setRushMode } =
    useRushStore()

  const options = [
    { value: 'accommodation.hotel', label: 'Accomodations' },
    { value: 'public_transport.bus', label: 'Bus stop' },
    { value: 'amenity.drinking_water', label: 'Drinking water' },
    { value: 'amenity.toilet', label: 'Toilets' },
    { value: 'commercial.gas', label: 'Petrol pump' },
  ]

  return (
    <div className={classes['showNearby']}>
      <div className={classes.heading}>Show places nearby me</div>
      <div className={classes['filters']}>
        <Select
          id="select"
          defaultValue={options[1]}
          onChange={(e) => {
            setRushParams(e.value)
            setRushMode(true)
            setRadius(radius)
            setRushRadius(radius)
          }}
          options={options}
          styles={{
            control: (provided, state) => ({
              ...provided,
              width: '100%',
              height: '4.5rem',
              padding: '0 1.5rem',
              borderRadius: '1rem',
              fontSize: '1.6rem',
              fontWeight: '500',
              color: '#131e22',
              backgroundColor: '#f0f4f5',
              border: state.isFocused
                ? '2px solid #131e22'
                : '2px solid transparent',
              boxShadow: 'none',
              '&:hover': {
                border: state.isFocused
                  ? '2px solid #131e22'
                  : '2px solid #999',
              },
            }),
            option: (provided, state) => ({
              ...provided,
              display: 'flex',
              alignItems: 'center',
              fontSize: '1.6rem',
              fontWeight: '500',
              color: '#131e22',
              backgroundColor: state.isFocused ? '#f0f4f5' : '#fff',
              '&:hover': {
                backgroundColor: '#f0f4f5',
              },
            }),
            dropdownIndicator: (provided) => ({
              ...provided,
              color: '#444C4D',
              '&:hover': {
                color: '#444c4d',
              },
            }),
            indicatorSeparator: () => ({
              display: 'none',
            }),
          }}
        />
      </div>
      <div className={classes.heading}>Within radius/distance (in metre)</div>
      <RadiusInput />
    </div>
  )
}

export default ShowNearby
