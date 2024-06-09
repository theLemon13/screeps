const roleBatteryGuy = {
  run: (creepName) => {
    // if storage is more then 60% full go to the storage and transfer energy
    creep = Game.creeps[creepName];
    if (creep.memory.makingBatteries && creep.store.getUsedCapacity() === 0) {
      creep.memory.makingBatteries = false;
    }

    if (!creep.memory.makingBatteries && creep.store.getFreeCapacity() === 0) {
      creep.memory.makingBatteries = true;
    }

    if (!creep.memory.makingBatteries && creep.room.storage.store.getUsedCapacity() > creep.room.storage.store.getCapacity() * 0.6) {
      const storage = creep.room.storage;
      if (storage) {
        if (creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(storage);
        }
      }
    } else {
      const factory = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (structure) => {
          return (
            structure.structureType === STRUCTURE_FACTORY
          );
        },
      });
      if (factory) {
        if (creep.transfer(factory, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(factory);
        }
      }
    }
  },
};

module.exports = roleBatteryGuy;