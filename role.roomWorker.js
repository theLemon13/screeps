const retreat = false;

const roleRoomWorker = {
  run: (creepName) => {
    //code here

    // THIS CODE IS NOW A LEGACY CODE DO NOT TOUCH IT

    const creep = Game.creeps[creepName];
    let targetRoomName = "E33S48";
    //let homeRoom = "E33S47";

    if (creep.pos.y === 0) {
      creep.move(BOTTOM);
    }

    if (creep.pos.y === 49) {
      creep.move(TOP);
    }

    /* if (retreat) {

    }
 //   */
    if (creep.room.name == targetRoomName) {
      //when in room E33S48
      if (creep.memory.upgrading === undefined) {
        creep.memory.upgrading = false;
      }

      if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.upgrading = false;
      }
      if (!creep.memory.upgrading && creep.store.getFreeCapacity() === 0) {
        creep.memory.upgrading = true;
      }

      // get dropped, ruins and tombstones
      if (!creep.memory.upgrading) {
        const droppedStuff = creep.pos.findClosestByPath(
          FIND_DROPPED_RESOURCES
        );
        const ruinsWithEnergy = creep.pos.findClosestByPath(FIND_RUINS, {
          filter: (ruin) => {
            ruin.store[RESOURCE_ENERGY] > 0;
          },
        });

        const tombstonesWithEnergy = creep.pos.findClosestByPath(
          FIND_TOMBSTONES,
          {
            filter: (ruin) => ruin.store[RESOURCE_ENERGY] > 0,
          }
        );

        if (droppedStuff) {
          if (creep.pickup(droppedStuff) === ERR_NOT_IN_RANGE) {
            creep.moveTo(droppedStuff);
          }
          return;
        }

        // if (ruinsWithEnergy) {
        //   if (
        //     creep.withdraw(ruinsWithEnergy, RESOURCE_ENERGY) ===
        //     ERR_NOT_IN_RANGE
        //   ) {
        //     creep.moveTo(ruinsWithEnergy);
        //   }
        //   return;
        // }
        if (tombstonesWithEnergy) {
          if (
            creep.withdraw(tombstonesWithEnergy, RESOURCE_ENERGY) ===
            ERR_NOT_IN_RANGE
          ) {
            creep.moveTo(tombstonesWithEnergy);
          }
          return;
        }
      }

      //mine

      if (!creep.memory.upgrading) {
        const source = creep.pos.findClosestByPath(FIND_SOURCES);
        const result = creep.harvest(source);
        if (result === ERR_NOT_IN_RANGE) {
          creep.moveTo(source);
          return;
        }
        return;
      }

      if (creep.memory.upgrading) {
        // first if it has energy and spawn and extensions are not full, then transfer energy
        if (creep.room.controller.ticksToDowngrade > 2500) {
          const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
              return (
                (structure.structureType == STRUCTURE_EXTENSION ||
                  structure.structureType == STRUCTURE_SPAWN) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
              );
            },
          });

          if (target) {
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.moveTo(target);
              return;
            }
            return;
          }
        }

        // If the creep is carrying energy, then build
        const constructionSite = creep.pos.findClosestByPath(
          FIND_CONSTRUCTION_SITES
        );
        if (constructionSite && creep.room.controller.ticksToDowngrade > 3000) {
          const constructResult = creep.build(constructionSite);
          console.log("constructionResult: ", constructResult);
          if (constructResult === ERR_NOT_IN_RANGE) {
            creep.moveTo(constructionSite);
            return;
          }
          return;
        }

        if (creep.room.controller.ticksToDowngrade > 3500) {
          const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
              return (
                structure.structureType == STRUCTURE_TOWER &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) >=
                  structure.store.getCapacity(RESOURCE_ENERGY) * 0.5
              );
            },
          });

          if (target) {
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.moveTo(target);
              return;
            }
            return;
          }
        }

        // repair roads and container
        const structuresToRepair = creep.pos.findInRange(FIND_STRUCTURES, 2, {
          filter: (structure) => {
            return (
              structure.structureType === STRUCTURE_ROAD ||
              (structure.structureType === STRUCTURE_CONTAINER &&
                structure.hits < structure.hitsMax * 0.4)
            );
          },
        });
        console.log(structuresToRepair);

        if (structuresToRepair.length > 0) {
          creep.repair(structuresToRepair[0]);
          // return;
        }

        // upgrade controller
        if (
          creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE
        ) {
          creep.moveTo(creep.room.controller);
          return;
        }
      }
    } else {
      const exit = creep.room.findExitTo(targetRoomName);
      creep.moveTo(creep.pos.findClosestByRange(exit));
      console.log("Moving to room " + targetRoomName);
    }
  },
};

module.exports = roleRoomWorker;
