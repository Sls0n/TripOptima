import classes from './SidebarHeader.module.scss'
import SwitchSelector from 'react-switch-selector'
import useSidebarStore from '../../store/sidebarStore'

const SidebarHeader = () => {
  const { setSidebarMode } = useSidebarStore()

  const options = [
    {
      label: 'Location',
      value: 'Location',
    },
    {
      label: 'Rush',
      value: 'Rush',
    },
    {
      label: 'Recommend',
      value: 'Recommend',
    },
  ]

  const onChange = (newValue) => {
    setSidebarMode(newValue)
  }

  return (
    <div className={classes.sidebar__header}>
      <div className={classes['sidebar__header-container']}>
        <h1 className={classes['sidebar__header-text']}>Map modes</h1>
        <button
          onClick={() => {}}
          className={classes['sidebar__header-button']}
        >
          Reset
        </button>
      </div>

      <div className={classes['sidebar__switch-button']}>
        <SwitchSelector
          onChange={onChange}
          options={options}
          backgroundColor="#fff"
          fontColor="rgba(51, 51, 51, 0.5)"
          selectedFontColor="#131e22"
          fontSize="16"
        />
      </div>
    </div>
  )
}

export default SidebarHeader
