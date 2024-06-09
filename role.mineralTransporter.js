const roleMineralTransporter = {
  run: (creepName, container) => {
    const creep = Game.creeps[creepName];

    // Make sure container object is not undefined, otherwise creep will stop working
    if (!container) return;

    if (creep.store.getUsedCapacity() == 0 && creep.ticksToLive < 75) {
      const spawn = Game.spawns["Spawn1"];
      if (spawn.recycleCreep(creep) == ERR_NOT_IN_RANGE) {
        creep.moveTo(spawn);
      }
      return;
    }
    //--------------------------------------------------------
    if (
      creep.store.getUsedCapacity(RESOURCE_LEMERGIUM) < // if not full
      creep.store.getCapacity()
    ) {
      if (creep.withdraw(container, RESOURCE_LEMERGIUM) == ERR_NOT_IN_RANGE) {
        creep.moveTo(container);
      }
      return;
    }
    //--------------------------------------------------------
    if (
      creep.store.getUsedCapacity(RESOURCE_LEMERGIUM) >=
      creep.store.getCapacity()
    ) {
      const storage = creep.room.storage;

      if (creep.transfer(storage, RESOURCE_LEMERGIUM) == ERR_NOT_IN_RANGE) {
        creep.moveTo(storage);
      }
      return;
    }
  },
};
module.exports = roleMineralTransporter;
