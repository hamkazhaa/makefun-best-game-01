// The one colour table for Harbour Line. Every mesh, light and HUD
// element draws from here so the dusk mood holds together: a cold blue
// sky, a low orange sun on the horizon, warm sodium lamps, wet concrete
// and rusted steel. The teams are told apart by accent alone — Vanguard
// is teal, Ember is orange — and the HUD reuses the same inks. A frozen
// object, so no module can drift a colour by accident.
const DUSK = Object.freeze({
  sky: 0x2b3550,
  horizon: 0xd98a4b,
  haze: 0x232a38,
  floor: 0x4b515a,
  floorDark: 0x3a4048,
  steel: 0x5f6d7c,
  steelDark: 0x46525e,
  rust: 0xa06b3e,
  rustLight: 0xc07f45,
  teal: 0x2fa8a0,
  tealDeep: 0x1d6f6a,
  ember: 0xe05a2a,
  emberDeep: 0x8f3413,
  lamp: 0xffb347,
  ink: 0xf2ede3,
  dim: 0x9aa3ad,
  gold: 0xffb347,
  danger: 0xe5484d,
  cash: 0x7fd08a,
  frost: 0x8fb8d8,
});

export { DUSK as PALETTE };
