roleLemergiumCompressor = {
  run: (creepName, factory, storage, terminal) => {
    const creep = Game.creeps[creepName];
    if (!creep || !factory || !storage || !terminal) {
      console.log(
        "Lemergium Compressor: missing creep, factory, storage, or terminal"
      );
      return;
    }

    // Recycle creep when no enough Lemergium to process or no compressed Lemergium to transfer
    if (
      storage.store.getUsedCapacity(RESOURCE_LEMERGIUM) < 10000 &&
      factory.store.getUsedCapacity(RESOURCE_LEMERGIUM_BAR) < 700
    ) {
      const spawn = Game.spawns["Spawn1"];
      if (spawn.recycleCreep(creep) === ERR_NOT_IN_RANGE) {
        creep.moveTo(spawn);
      }
      return;
    }

    // Before getting resources to factory get the lemergium bars to storage from factory
    if (
      factory.store.getUsedCapacity(RESOURCE_LEMERGIUM_BAR) >= 700 &&
      creep.store.getFreeCapacity() >= 700
    ) {
      if (
        creep.withdraw(factory, RESOURCE_LEMERGIUM_BAR) === ERR_NOT_IN_RANGE
      ) {
        creep.moveTo(factory);
      }
      return;
    }

    if (creep.store.getUsedCapacity(RESOURCE_LEMERGIUM_BAR) > 0) {
      if (
        creep.transfer(storage, RESOURCE_LEMERGIUM_BAR) === ERR_NOT_IN_RANGE
      ) {
        creep.moveTo(storage);
      }
      return;
    }

    // Get resources to factory
    if (
      creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0 &&
      creep.store.getUsedCapacity(RESOURCE_LEMERGIUM) > 0
    ) {
      if (creep.transfer(factory, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(factory);
      }
      return;
    }

    if (creep.store.getUsedCapacity(RESOURCE_LEMERGIUM) > 0) {
      if (creep.transfer(factory, RESOURCE_LEMERGIUM) === ERR_NOT_IN_RANGE) {
        creep.moveTo(factory);
      }
      return;
    }

    // Get resources to factory from storage
    if (creep.store[RESOURCE_ENERGY] === 0) {
      if (creep.withdraw(storage, RESOURCE_ENERGY, 200) === ERR_NOT_IN_RANGE) {
        creep.moveTo(storage);
      }
      return;
    }

    if (creep.store[RESOURCE_LEMERGIUM] === 0) {
      if (
        creep.withdraw(storage, RESOURCE_LEMERGIUM, 500) === ERR_NOT_IN_RANGE
      ) {
        creep.moveTo(storage);
      }
      return;
    }
  },
};

module.exports = roleLemergiumCompressor;
