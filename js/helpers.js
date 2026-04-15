function resolveBoxCollision(mover, target) {
  if (!target.collider) return false;

  const collider = target.collider;

  // Ker ni rotacije, sta dx in dy že v "lokalnem" prostoru
  const dx = mover.position.x - target.position.x;
  const dy = mover.position.y - target.position.y;

  const halfW = collider.width / 2;
  const halfH = collider.height / 2;
  
  // Določitev radija
  let radius = 0;
  if (mover.diameter !== undefined) {
    radius = mover.diameter / 2; 
  } else if (mover.collider) {
    radius = Math.max(mover.collider.width, mover.collider.height) / 2;
  }

  // ====================
  //  INVERTED COLLISION (WORLD BOUNDARIES)
  // ====================
  if (collider.inverted) {
    let bounced = false;
    let normalX = 0;
    let normalY = 0;

    // Preverjanje mej (brez sin/cos matrik)
    if (dx > halfW - radius) {
      mover.position.x = target.position.x + halfW - radius; 
      normalX = -1; bounced = true;
    } else if (dx < -halfW + radius) {
      mover.position.x = target.position.x - halfW + radius; 
      normalX = 1; bounced = true;
    }

    if (dy > halfH - radius) {
      mover.position.y = target.position.y + halfH - radius; 
      normalY = -1; bounced = true;
    } else if (dy < -halfH + radius) {
      mover.position.y = target.position.y - halfH + radius; 
      normalY = 1; bounced = true;
    }

    if (bounced) {
      // Odboj hitrosti: v' = v - 2 * (v ⋅ n) * n
      const dot = (mover.velocity.x * normalX) + (mover.velocity.y * normalY);
      if (dot < 0) {
        mover.velocity.x -= 2 * dot * normalX;
        mover.velocity.y -= 2 * dot * normalY;
        
        if (mover.direction) {
          mover.direction.x = mover.velocity.x;
          mover.direction.y = mover.velocity.y;
          mover.direction.normalize();
        }
      }
      return true; 
    }
    return false;
  }

  // ==========================================
  // STANDARD COLLISION (PADDLE / BRICKS)
  // ==========================================
  // Poiščemo najbližjo točko na pravokotniku (AABB logic)
  const closestX = Math.max(-halfW, Math.min(dx, halfW));
  const closestY = Math.max(-halfH, Math.min(dy, halfH));

  const diffX = dx - closestX;
  const diffY = dy - closestY;
  const distanceSq = (diffX * diffX) + (diffY * diffY);

  if (distanceSq <= radius * radius) {
    const distance = Math.sqrt(distanceSq) || 0.0001;
    const penetration = radius - distance;

    // Normala trka
    const normalX = diffX / distance;
    const normalY = diffY / distance;

    // Popravek pozicije (da žogica ne obtiči v objektu)
    mover.position.x += normalX * penetration;
    mover.position.y += normalY * penetration;

    const dot = (mover.velocity.x * normalX) + (mover.velocity.y * normalY);

    if (dot < 0) {
      mover.velocity.x -= 2 * dot * normalX;
      mover.velocity.y -= 2 * dot * normalY;
      
      if (mover.direction) {
        mover.direction.x = mover.velocity.x;
        mover.direction.y = mover.velocity.y;
        mover.direction.normalize();
      }

      if (mover instanceof Ball && target.healthComponent) {
        target.healthComponent.takeDamage(1);
      }
    }
    return true; 
  }
  
  return false; 
}