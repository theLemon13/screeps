const roleTower = {
  run: (towerId) => {
    // tower code here

    const tower = Game.structures[towerId];

    if (towerId) {
      // if there are enemys, attack the first one
      let hostiles = tower.room.find(FIND_HOSTILE_CREEPS);
      if (hostiles.length > 0) {
        console.log("Attacking enemy: ", hostiles[0].pos);
        tower.attack(hostiles[0]);
        return;
      }
      
      // If there are creeps that need healing, heal the first one
     // if (creepsNeedHeal.length > 0) {
       // console.log("Healing creep: ", creepsNeedHeal[0].pos);
      //  towerId.heal(creepsNeedHeal[0]);
     //   return;
    //  } 
      // If there are no creeps that need healing, find structures to repair
      let structuresToFix = Game.rooms["E33S48"].find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType !== STRUCTURE_WALL && structure.hits < structure.hitsMax * 0.8,
      });
      let structureWithLeastHits = structuresToFix.reduce(
        (least, structure) => {
          return least && least.hits < structure.hits ? least : structure;
        },
        null
      );

      // If there are structures that need repairing, repair the one with the least hits
      if (structureWithLeastHits) {
        console.log("Repairing structure: ", structureWithLeastHits.pos);
        tower.repair(structureWithLeastHits);
      }
    }
  },
};

module.exports = roleTower;
