const upgraderLocation1 = { x: 43, y: 15 };
const upgraderLocation2 = { x: 42, y: 16 };

const roleUpgrader = {
  run: (creep) => {
    // Move to one of the upgrader's locations if not already there
    if (
      !(
        creep.pos.x === upgraderLocation1.x &&
        creep.pos.y === upgraderLocation1.y
      ) &&
      !(
        creep.pos.x === upgraderLocation2.x &&
        creep.pos.y === upgraderLocation2.y
      )
    ) {
      console.log("upgraders not in place");
      if (
        creep.room.lookForAt(
          LOOK_CREEPS,
          upgraderLocation1.x,
          upgraderLocation1.y
        ).length === 0
      ) {
        creep.moveTo(upgraderLocation1.x, upgraderLocation1.y);
        return;
      }
      if (
        creep.room.lookForAt(
          LOOK_CREEPS,
          upgraderLocation2.x,
          upgraderLocation2.y
        ).length === 0
      ) {
        creep.moveTo(upgraderLocation2.x, upgraderLocation2.y);
        return;
      }
    }
    
    if (creep.store[RESOURCE_ENERGY] == 0) {
      // If empty, find closest container and try to withdraw energy
      let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) =>
          s.structureType == STRUCTURE_CONTAINER &&
          s.store.getUsedCapacity(RESOURCE_ENERGY) > 0,
      });
      if (container) {
        const withdrawResult = creep.withdraw(container, RESOURCE_ENERGY);
      }
    } else {
      // If not empty, upgrade the controller
      const upgradeResult = creep.upgradeController(creep.room.controller);
    }
  },
};

module.exports = roleUpgrader;
