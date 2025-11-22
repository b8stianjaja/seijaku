import { StateCreator } from 'zustand'

export interface DebugSlice {
  debug: boolean
  toggleDebug: () => void
}

export const createDebugSlice: StateCreator<DebugSlice> = (set) => ({
  debug: false,
  toggleDebug: () => set((state) => ({ debug: !state.debug })),
})