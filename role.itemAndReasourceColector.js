const { filter } = require("lodash");

const roleCollector = {
  run: (creepName) => {
    // code here
    creep = Game.creeps[creepName];

    if (creep.memory.depositing && creep.store.getUsedCapacity() === 0) {
      creep.memory.depositing = false;
    }

    if (!creep.memory.depositing && creep.store.getFreeCapacity() === 0) {
      creep.memory.depositing = true;
    }
    if (!creep.memory.depositing) {
      const target = creep.pos.findClosestByPath(FIND_RUINS, {
        filter: (ruin) => ruin.store.getUsedCapacity(RESOURCE_UTRIUM) > 0,
      });

      if (target) {
        if (creep.withdraw(target, RESOURCE_UTRIUM) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        }
      }
    }

    const container = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => structure.structureType === STRUCTURE_CONTAINER,
    });

    console.log("___container", container);

    if (creep.memory.depositing) {
      console.log("-----------------------------------------");
      // If creep is full, find closest container or storage and transfer the resource
      const storageTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType === STRUCTURE_CONTAINER,
      });
      console.log(storageTarget);

      if (storageTarget) {
        if (
          creep.transfer(storageTarget, RESOURCE_UTRIUM) === ERR_NOT_IN_RANGE
        ) {
          creep.moveTo(storageTarget);
        }
      }

      // const myRuinWithResources = creep.pos.findClosestByPath(FIND_RUINS, {
      //   filter: (ruin) => {
      //     const resources = Object.keys(ruin.store); // [RESOURCE_ENERGY, RESOURCE_LEMERGIUM, RESOURCE_UTRIUM]
      //     return resources.some(
      //       (resource) =>
      //         ruin.store[resource] > 0
      //     );
      //   },
      // });
    }
  },
};

module.exports = roleCollector;
