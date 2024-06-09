const roleMineralMiner = {
  run: (creepName, container) => {
    const creep = Game.creeps[creepName];

    // Make sure container object is not undefined, otherwise creep will stop working
    if(!container) return

    if (creep.ticksToLive < 5) {
      if (creep.transfer(container, RESOURCE_LEMERGIUM) == ERR_NOT_IN_RANGE) {
        creep.moveTo(container);
      }
      return;
    }
    //--------------------------------------------------------
    if (creep.store.getUsedCapacity() < creep.store.getCapacity()) {
      const mineral = creep.pos.findClosestByPath(FIND_MINERALS);
      if (creep.harvest(mineral) == ERR_NOT_IN_RANGE) {
        creep.moveTo(mineral);
      }
      return;
    }
    //--------------------------------------------------------
    if (
      creep.store.getUsedCapacity(RESOURCE_LEMERGIUM) ==
      creep.store.getCapacity()
    ) {
      if (creep.transfer(container, RESOURCE_LEMERGIUM) == ERR_NOT_IN_RANGE) {
        creep.moveTo(container);
      }
      return;
    }
  },
};
module.exports = roleMineralMiner;
