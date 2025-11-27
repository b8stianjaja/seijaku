import { Vector3, Color } from 'three'

export const RIVER_CONFIG = {
  speed: 0.1, 
  sunPosition: new Vector3(5, 15, -5), 
  colors: {
    // Slight teal tint instead of pure ice white gives it 'substance' without opacity
    water: new Color('#eefbfd'), 
    // Lighter teal, less black/ink-like
    deep: new Color('#106070'),  
    sun: new Color('#ffffff'),   
    sand: new Color('#f0e6d2'),  
  }
}