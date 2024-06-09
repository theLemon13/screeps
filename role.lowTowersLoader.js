roleLowTowerLoader = {
  run: (creepName) => {
    const creep = Game.creeps[creepName];
    const linkTower = Game.structures["660941258e7fe73ade42ef29"];

    if (creep.ticksToLive < 5) {
      creep.transfer(linkTower, RESOURCE_ENERGY);
      return;
    }

    // Find the tower with the lowest energy
    const towers = creep.room.find(FIND_STRUCTURES, {
      filter: (s) => s.structureType == STRUCTURE_TOWER && s.pos.y > 30,
    });
    const tower = towers.reduce((lowest, tower) => {
      if (tower.store[RESOURCE_ENERGY] < lowest.store[RESOURCE_ENERGY]) {
        return tower;
      } else {
        return lowest;
      }
    }, towers[0]);

    // if tower not full, fill it from link energy
    if (tower.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
      if (creep.withdraw(linkTower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(linkTower);
        // return;
      }
      if(creep.transfer(tower, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
        creep.moveTo(tower)
      }
      return;
    }

    creep.moveTo(25, 35);
  },
};

module.exports = roleLowTowerLoader;
