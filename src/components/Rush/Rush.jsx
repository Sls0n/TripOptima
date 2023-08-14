import classes from './Rush.module.scss'
import ShowNearby from '../Sidebar/ShowNearby'

export default function Rush() {
  return (
    <div className={classes.rush}>
      <ShowNearby />
    </div>
  )
}
