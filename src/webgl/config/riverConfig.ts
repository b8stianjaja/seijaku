import { Vector3, Color } from 'three'

export const RIVER_CONFIG = {
  speed: 0.1, // The "Majestic" slow flow speed
  sunPosition: new Vector3(5, 15, -5), // Fixed sun position
  colors: {
    water: new Color('#e0f7fa'), // Ice Clear
    deep: new Color('#004050'),  // Deep Teal
    sun: new Color('#ffffff'),   // Pure White
    sand: new Color('#f0e6d2'),  // White Sand
  }
}