import { create } from 'zustand'
import { createDebugSlice, DebugSlice } from './stores/debug.slice'
import { createInteractionSlice, InteractionSlice } from './stores/interaction.slice'

// Combine all slices into one AppState
type AppState = DebugSlice & InteractionSlice

export const useStore = create<AppState>()((...a) => ({
  ...createDebugSlice(...a),
  ...createInteractionSlice(...a),
}))