import { StateCreator } from 'zustand'

export interface InteractionSlice {
  hoveredService: string | null
  isAppReady: boolean
  setHoveredService: (id: string | null) => void
  setAppReady: (ready: boolean) => void
}

export const createInteractionSlice: StateCreator<InteractionSlice> = (set) => ({
  hoveredService: null,
  isAppReady: false,
  setHoveredService: (id) => set({ hoveredService: id }),
  setAppReady: (ready) => set({ isAppReady: ready }),
})