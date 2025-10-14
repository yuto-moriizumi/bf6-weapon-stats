/**
 * Damage range type representing damage at a specific distance
 */
export type DamageRange = {
  distance: number
  damage: number
}

/**
 * Calculate Time To Kill (TTK) in milliseconds
 * 
 * This function calculates the TTK including bullet travel time based on bullet velocity.
 * The calculation accounts for:
 * 1. Bullet travel time to reach the target
 * 2. Time between shots based on fire rate
 * 
 * @param damages - Array of damage ranges (can be sorted or unsorted)
 * @param distance - Target distance in meters
 * @param bulletVelocity - Bullet velocity in m/s
 * @param fireRate - Fire rate in rounds per minute (RPM)
 * @returns TTK in milliseconds
 */
export function calculateTTK(
  damages: DamageRange[],
  distance: number,
  bulletVelocity: number,
  fireRate: number
): number {
  if (damages.length === 0) return 0

  // Sort damages by distance to ensure correct calculation
  const sortedDamages = [...damages].sort((a, b) => a.distance - b.distance)
  
  // Find the applicable damage for the given distance
  let damage = sortedDamages[0].damage
  
  for (let i = 0; i < sortedDamages.length; i++) {
    if (sortedDamages[i].distance <= distance) {
      damage = sortedDamages[i].damage
    } else {
      break
    }
  }
  
  // Calculate shots needed to kill (assuming 100 HP)
  const shotsToKill = Math.ceil(100 / damage)
  
  // Calculate time between shots in milliseconds
  const timeBetweenShots = 60000 / fireRate
  
  // Calculate bullet travel time in milliseconds
  const bulletTravelTime = (distance / bulletVelocity) * 1000
  
  // Total TTK = bullet travel time + time to fire all shots
  // (shotsToKill - 1) because the first shot is instant after bullet arrives
  const totalTTK = bulletTravelTime + (shotsToKill - 1) * timeBetweenShots
  
  return totalTTK
}
