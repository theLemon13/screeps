const roleSeller = {
  run: (creepName, terminal, storage, terminalResourcesGoal) => {
    if (!creepName || !terminal || !storage) {
      console.log("Seller: missing creep, terminal, or storage");
      return;
    }

    const creep = Game.creeps[creepName];

    for (let resource in terminalResourcesGoal) {
      if (terminal.store[resource] < terminalResourcesGoal[resource]) {
        if (creep.store.getFreeCapacity() < creep.store.getCapacity()) {
          if (creep.transfer(terminal, resource) === ERR_NOT_IN_RANGE) {
            creep.moveTo(terminal);
          }
          return;
        }

        if (creep.store.getFreeCapacity() === creep.store.getCapacity()) {
          if (creep.withdraw(storage, resource) === ERR_NOT_IN_RANGE) {
            creep.moveTo(storage);
          }
          return;
        }
      }
    }

    // recycle creep
    const spawn = Game.spawns["Spawn1"];
    if (spawn.recycleCreep(creep) === ERR_NOT_IN_RANGE) {
      creep.moveTo(spawn);
    }
  },
};

module.exports = roleSeller;
