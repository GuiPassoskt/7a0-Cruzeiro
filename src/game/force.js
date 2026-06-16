// Player "force" (strength) de-obfuscation.
// In the squad JSON the `f` field is XOR-masked with an FNV-1a hash of the
// playerId, so ratings can't be trivially read from the raw data files.

const SALT = '7a0::alm::v1'

/** Low byte of FNV-1a(playerId + salt). */
function fnvForceMask(playerId) {
  let h = 0x811c9dc5 // FNV offset basis
  const s = playerId + SALT
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x1000193) // FNV prime
  }
  return (h >>> 0) & 255
}

/** Recover the real 0–255 force for a player record. */
export function realForce(player) {
  return (player.f ^ fnvForceMask(player.playerId)) & 255
}

/** Return a player object with the de-obfuscated `force` field. */
export function deobfuscatePlayer(player) {
  return { ...player, force: realForce(player) }
}
