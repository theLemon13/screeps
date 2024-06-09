const attackLocations = [
  { x: 10, y: 29 }, // Middle rampart
  { x: 12, y: 29 }, // Right rampart
  { x: 8, y: 29 }, // Left rampart
];

const roleDefender = {
  run: (creep) => {
    let closestEnemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (closestEnemy) {
      // Move towards the target take one of three attack locations:
      let isAtAttackLocation = attackLocations.some(
        (location) => location.x === creep.pos.x && location.y === creep.pos.y
      );

      if (!isAtAttackLocation) {
        let targetLocation = null;

        for (let location of attackLocations) {
          const objectsAtLocation = creep.room.lookForAt(
            LOOK_CREEPS,
            location.x,
            location.y
          );
          if (objectsAtLocation.length === 0) {
            // If there are no creeps at this location
            targetLocation = location;
            break;
          }
        }

        if (targetLocation) {
          creep.moveTo(targetLocation.x, targetLocation.y);
        }
        return;
      }

      // Try to attack the closest enemy
      const attackResult = creep.rangedAttack(closestEnemy);
      if (attackResult == ERR_NOT_IN_RANGE) {
        console.log("rangedAttack failed, result: ", attackResult);
      }
    } else {
      // If there are no enemies, move to a spawner for recycling
      const spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS);
      const recycleResult = spawn.recycleCreep(creep);
      if (recycleResult === ERR_NOT_IN_RANGE) {
        creep.moveTo(spawn);
      }
    }
  },
};

module.exports = roleDefender;
