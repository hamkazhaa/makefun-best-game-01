// The player's body: acceleration, friction, gravity, crouch and jump,
// resolved as a box against the map's colliders one axis at a time, so a
// wall never swallows the player. Spread and recoil read the speed this
// module reports.
import * as THREE from 'three';

const RADIUS = 0.34;
const STAND_HEIGHT = 1.72;
const CROUCH_HEIGHT = 1.12;
const STAND_EYE = 1.6;
const CROUCH_EYE = 1.02;
const WALK_SPEED = 5.4;
const CROUCH_SPEED = 2.5;
const ADS_SPEED = 3.4;
const GROUND_ACCEL = 46;
const AIR_ACCEL = 10;
const FRICTION = 10;
const GRAVITY = 21;
const JUMP_SPEED = 6.4;

export function createPlayer(colliders, spawn) {
  const state = {
    pos: new THREE.Vector3(spawn.x, 0, spawn.z),
    vel: new THREE.Vector3(),
    yaw: spawn.yaw,
    pitch: 0,
    eye: STAND_EYE,
    onGround: true,
    crouching: false,
    height: STAND_HEIGHT,
    health: 100,
    armor: 0,
    alive: true,
  };
  const probe = new THREE.Box3();
  const wish = new THREE.Vector3();

  function overlaps(x, y, z, height, lift) {
    probe.min.set(x - RADIUS, y + lift, z - RADIUS);
    probe.max.set(x + RADIUS, y + height - lift, z + RADIUS);
    for (const collider of colliders) if (probe.intersectsBox(collider)) return collider;
    return null;
  }

  function look(dx, dy, sensitivity = 0.0021) {
    state.yaw -= dx * sensitivity;
    state.pitch = Math.max(-1.45, Math.min(1.45, state.pitch - dy * sensitivity));
  }

  function recoil(pitchKick, yawKick) {
    state.pitch = Math.min(1.45, state.pitch + pitchKick);
    state.yaw += yawKick;
  }

  function step(dt, keys, aiming) {
    if (!state.alive) return;
    const wantCrouch = keys.has('ControlLeft') || keys.has('ControlRight') || keys.has('KeyC');
    if (wantCrouch && !state.crouching) {
      state.crouching = true;
      state.height = CROUCH_HEIGHT;
    } else if (!wantCrouch && state.crouching && !overlaps(state.pos.x, state.pos.y, state.pos.z, STAND_HEIGHT, 0.02)) {
      state.crouching = false;
      state.height = STAND_HEIGHT;
    }
    const eyeTarget = state.crouching ? CROUCH_EYE : STAND_EYE;
    state.eye += (eyeTarget - state.eye) * Math.min(1, dt * 12);

    const forward = (keys.has('KeyW') ? 1 : 0) - (keys.has('KeyS') ? 1 : 0);
    const strafe = (keys.has('KeyD') ? 1 : 0) - (keys.has('KeyA') ? 1 : 0);
    wish.set(0, 0, 0);
    if (forward || strafe) {
      const sin = Math.sin(state.yaw);
      const cos = Math.cos(state.yaw);
      wish.set(-sin * forward + cos * strafe, 0, -cos * forward - sin * strafe).normalize();
    }

    let speed = state.crouching ? CROUCH_SPEED : WALK_SPEED;
    if (aiming) speed = Math.min(speed, ADS_SPEED);
    const blend = Math.min(1, ((state.onGround ? GROUND_ACCEL : AIR_ACCEL) * dt) / speed);
    state.vel.x += (wish.x * speed - state.vel.x) * blend;
    state.vel.z += (wish.z * speed - state.vel.z) * blend;
    if (state.onGround && !wish.lengthSq()) {
      const damp = Math.max(0, 1 - FRICTION * dt);
      state.vel.x *= damp;
      state.vel.z *= damp;
    }

    if (keys.has('Space') && state.onGround) {
      state.vel.y = JUMP_SPEED;
      state.onGround = false;
    }
    state.vel.y -= GRAVITY * dt;

    const nextX = state.pos.x + state.vel.x * dt;
    if (!overlaps(nextX, state.pos.y, state.pos.z, state.height, 0.04)) state.pos.x = nextX;
    else state.vel.x = 0;
    const nextZ = state.pos.z + state.vel.z * dt;
    if (!overlaps(state.pos.x, state.pos.y, nextZ, state.height, 0.04)) state.pos.z = nextZ;
    else state.vel.z = 0;

    state.pos.y += state.vel.y * dt;
    state.onGround = false;
    const hit = overlaps(state.pos.x, state.pos.y, state.pos.z, state.height, 0);
    if (hit && state.vel.y <= 0) {
      state.pos.y = hit.max.y;
      state.vel.y = 0;
      state.onGround = true;
    } else if (hit) {
      state.pos.y = hit.min.y - state.height;
      state.vel.y = 0;
    }
    if (state.pos.y < 0) {
      state.pos.y = 0;
      state.vel.y = 0;
      state.onGround = true;
    }
    state.vel.y = Math.max(-30, state.vel.y);
    // Keep the player inside the dock.
    state.pos.x = Math.max(-25.4, Math.min(25.4, state.pos.x));
    state.pos.z = Math.max(-17.4, Math.min(17.4, state.pos.z));
  }

  function respawn(spawnPoint) {
    state.pos.set(spawnPoint.x, 0, spawnPoint.z);
    state.vel.set(0, 0, 0);
    state.yaw = spawnPoint.yaw;
    state.pitch = 0;
    state.health = 100;
    state.armor = 0;
    state.alive = true;
    state.crouching = false;
    state.height = STAND_HEIGHT;
    state.eye = STAND_EYE;
  }

  return {
    state, step, look, recoil, respawn,
    eyePosition(out) {
      out.set(state.pos.x, state.pos.y + state.eye, state.pos.z);
      return out;
    },
    groundSpeed() { return Math.hypot(state.vel.x, state.vel.z); },
  };
}
