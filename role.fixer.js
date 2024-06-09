const roleFixer = {
  run: (creep) => {
    // If creep ticksToLive is less than 1200 and creep is next to a spawn, renew it
    let spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS);

    // If picked up Lemergium, transfer it to storage
    if (creep.store.getUsedCapacity(RESOURCE_LEMERGIUM) > 0) {
      if (
        creep.transfer(creep.room.storage, RESOURCE_LEMERGIUM) ==
        ERR_NOT_IN_RANGE
      ) {
        creep.moveTo(creep.room.storage);
      }
      return;
    }

    // if picked up Lemergium bar, transfer it to storage
    if (creep.store.getUsedCapacity(RESOURCE_LEMERGIUM_BAR) > 0) {
      if (
        creep.transfer(creep.room.storage, RESOURCE_LEMERGIUM_BAR) ==
        ERR_NOT_IN_RANGE
      ) {
        creep.moveTo(creep.room.storage);
      }
      return;
    }

    // If empty, first try to find dropped resources
    if (creep.store.getUsedCapacity() == 0) {
      let droppedResource = creep.pos.findClosestByPath(
        FIND_DROPPED_RESOURCES,
        {
          filter: (r) =>
            (r.resourceType == RESOURCE_ENERGY ||
              r.resourceType == RESOURCE_LEMERGIUM ||
              r.resourceType == RESOURCE_LEMERGIUM_BAR) &&
              r.pos.y < 38 && r.pos.x > 23 &&  
            // Exclude positions of miners as they will collect dropped energy by themselves
            !(
              (r.pos.x == 31 && r.pos.y == 20) ||
              (r.pos.x == 31 && r.pos.y == 12)
            ),
        }
      );
      let tombstone = creep.pos.findClosestByPath(FIND_TOMBSTONES);
      console.log("tombstone: ", JSON.stringify(tombstone));
      // TODO: not picking up tombstone resources. Fix this.
      if (droppedResource) {
        console.log("droppedResource: ", JSON.stringify(droppedResource));
        if (
          creep.pickup(droppedResource ? droppedResource : tombstone) ==
          ERR_NOT_IN_RANGE
        ) {
          creep.moveTo(droppedResource ? droppedResource : tombstone);
        }
      } else {
        // check if storage link has energy more than 750 and pick it up
        let linkStorage = Game.structures["66052e496528663bb98da1b8"];

        if (
          linkStorage &&
          linkStorage.store.getUsedCapacity(RESOURCE_ENERGY) >= 500
        ) {
          if (
            creep.withdraw(linkStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
          ) {
            creep.moveTo(linkStorage);
          }
          return;
        }

        // If no link resources, find closest container and withdraw energy
        let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          filter: (s) =>
            s.structureType == STRUCTURE_CONTAINER &&
            s.store.getUsedCapacity(RESOURCE_ENERGY) > 899 && // change to 899 after fixers upgraded
            !(s.pos.x == 42 && s.pos.y == 15), // Exclude the upgrader container
        });

        if (container) {
          const withdrawResult = creep.withdraw(container, RESOURCE_ENERGY);
          if (withdrawResult == ERR_NOT_IN_RANGE) {
            creep.moveTo(container);
          }
        } else {
          // If no container with energy, find closest storage and withdraw energy
          // to fill the Spawn1 and extensions (be ready to spawn when needed)
          // if hostiles, use stored energy to fill tower
          let hostileCreepsCount = creep.room.find(FIND_HOSTILE_CREEPS).length;
          let spawnIsNotFull =
            Game.spawns["Spawn1"].store.getFreeCapacity(RESOURCE_ENERGY) > 0 &&
            creep.memory.isRenewing === false;
          let extension = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) =>
              s.structureType == STRUCTURE_EXTENSION &&
              s.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
          });
          if (spawnIsNotFull || extension || hostileCreepsCount > 0) {
            console.log(
              `\n!!!EXTREME SITUATION!!! ${
                !!spawnIsNotFull ? "Spawn1 energy below 300" : ""
              } ${!!extension ? "Some extensions need energy" : ""} ${
                hostileCreepsCount > 0 ||
                "Hostile creeps count: " + hostileCreepsCount
              } \n`
            );
            let storage = creep.room.storage;

            if (storage) {
              if (
                creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
              ) {
                creep.moveTo(storage);
              }
            }
          } else {
            // lets first figure out if this creep is the oldest one if so it is the one that will be renewed
            // let creeps = _.filter(
            //   Game.creeps,
            //   (creep) => creep.memory.role === "fixer"
            // );
            // let oldestCreep = creeps[0];
            // for (let i = 1; i < creeps.length; i++) {
            //   if (creeps[i].ticksToLive > oldestCreep.ticksToLive) {
            //     oldestCreep = creeps[i];
            //   }
            // }

            // lets check that oldest creep is this one

            // lets check if we are near the spawn
            if (creep.ticksToLive > 1400) {
              creep.memory.isRenewing = false;
            }
            if (creep.ticksToLive < 1200 || creep.memory.isRenewing) {
              creep.memory.isRenewing = true;

              if (spawn.renewCreep(creep) === ERR_NOT_IN_RANGE) {
                creep.moveTo(spawn);
                return;
              }
              return;
            }

            // go to the storage link and wait
            let linkStorage = Game.structures["66052e496528663bb98da1b8"];
            creep.moveTo(41, 13);
          }
        }
      }
    } else {
      // If almost full, fill Spawn1 and extensions
      // Creep is full of energy, first try to transfer energy to "Spawn1"
      let spawn = Game.spawns["Spawn1"];

      if (spawn && spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
        if (creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(spawn);
        }
      } else {
        // If "Spawn1" is full, find closest container
        var extension = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          filter: (s) =>
            s.structureType == STRUCTURE_EXTENSION &&
            s.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
        });

        if (extension) {
          // Try to transfer energy, if the container is not in range, move to the container
          if (creep.transfer(extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(extension);
          }
        } else {
          // if all containers are full, fill tower
          let towerFreeCapacity;
          let hostileCreeps = creep.room.find(FIND_HOSTILE_CREEPS);
          if (hostileCreeps.length > 0) {
            towerFreeCapacity = 200; // minimum available storage for tower to get energy from fixers when hostiles in the room
          } else {
            towerFreeCapacity = 500; // minimum available storage for tower to get energy from fixers
          }
          let tower = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) =>
              s.structureType == STRUCTURE_TOWER &&
              s.store.getFreeCapacity(RESOURCE_ENERGY) > towerFreeCapacity, // Don't fill the tower if it has more than 100 energy
          });

          if (tower) {
            const transferResult = creep.transfer(tower, RESOURCE_ENERGY);
            if (transferResult == ERR_NOT_IN_RANGE) {
              creep.moveTo(tower);
            }
          } else {
            // if no tower to fill or tower has more than 500 energy, fill upgrader container with up to 250 energy

            let structuresAtPos = creep.room.lookForAt(LOOK_STRUCTURES, 42, 15);
            let upgraderContainer = structuresAtPos.find(
              (s) =>
                s.structureType == STRUCTURE_CONTAINER &&
                s.store.getUsedCapacity(RESOURCE_ENERGY) < 1000 // if more than that, consider it is full (make higher for more energy delivered to upgrade controller)
            );
            if (upgraderContainer && creep.store.getUsedCapacity() > 0) {
              const transferResult = creep.transfer(
                upgraderContainer,
                RESOURCE_ENERGY
                // 300 //Uncomment to get the storage get some energy as well. (commented at 73'415, level: 324k/405k 9/3/2024, 1.36)
              );
              if (transferResult == ERR_NOT_IN_RANGE) {
                creep.moveTo(42, 15);
              }
            } else {
              // the rest is going in to the global storage
              let storage = creep.room.storage;
              if (storage) {
                const transferResult = creep.transfer(storage, RESOURCE_ENERGY);
                if (transferResult == ERR_NOT_IN_RANGE) {
                  creep.moveTo(storage);
                }
                return;
              }
            }
          }
        }
      }
    }
  },
};

module.exports = roleFixer;
