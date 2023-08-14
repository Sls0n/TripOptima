import { create } from 'zustand'

const useRushStore = create((set) => ({
  rushMode: false,
  setRushMode: (rushMode) => set({ rushMode }),

  rushRadius: 500,
  setRushRadius: (rushRadius) => set({ rushRadius }),

  rushParams: null,
  setRushParams: (rushParams) => set({ rushParams }),

  rushType: 'short',
  setRushType: (rushType) => set({ rushType }),

  alertMode: false,
  setAlertMode: (alertMode) => set({ alertMode }),

  radius: 500,
  setRadius: (radius) => set({ radius }),
}))

export default useRushStore
