import classes from './RadiusInput.module.scss'
import useRushStore from '../../store/rushStore'

const RadiusInput = () => {
  const { setRushRadius, radius, setRadius } = useRushStore()

  return (
    <form>
      <input
        className={classes.input}
        type="number"
        placeholder="Show within radius"
        value={radius}
        onChange={(e) => {
          setRadius(e.target.value)
          setRushRadius(e.target.value)
        }}
      />
    </form>
  )
}

export default RadiusInput
