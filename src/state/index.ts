import { create } from 'zustand'
import { createDebugSlice, DebugSlice } from './stores/debug.slice'

// Combine all slices into one AppState
type AppState = DebugSlice

export const useStore = create<AppState>()((...a) => ({
  ...createDebugSlice(...a),
}))