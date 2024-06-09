const utils = require("utils");
const roleDefender = require("role.defender");
const roleUpgrader = require("role.upgrader");
const roleFixer = require("role.fixer");
const roleScout = require("role.scout");
const roleMineralMiner = require("role.mineralMiner");
const roleLowTowerLoader = require("role.lowTowersLoader");
const roleMineralTransporter = require("role.mineralTransporter");
const roleLemergiumCompressor = require("role.lemergiumCompressor");
const roleSeller = require("role.seller");
const roleRoomWorker = require("role.roomWorker");
const roleRoomClaimer = require("role.roomClaimer");
const roleCollector = require("role.itemAndReasourceColector");
const roleTower = require("role.tower");
const roleBatteryGuy = require("role.batteryGuy");
//const roleSmallClaimer = require("role.roomSmallClaimer");


const roomStorage = Game.rooms["E33S47"].storage;
const roomTerminal = Game.rooms["E33S47"].terminal;
const roomFactory = Game.rooms["E33S47"].find(FIND_STRUCTURES, {
  filter: (s) => s.structureType == STRUCTURE_FACTORY,
})[0];

const containers = Game.rooms["E33S47"].find(FIND_STRUCTURES, {
  filter: (s) =>
    s.structureType == STRUCTURE_CONTAINER && s.pos.x == 11 && s.pos.y == 42,
});
let container;
if (containers) {
  container = containers[0];
}

const terminalResourcesGoal = {
  [RESOURCE_ENERGY]: 3000,
  [RESOURCE_LEMERGIUM_BAR]: 8500,
};

console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
console.log(
  `### ${Game.time} #### Creeps Total: ${Object.keys(Game.creeps).length} ###`
);

const revealCreeps = false;

// Find enemies, store in spawn memory their details
let enemies = Game.rooms["E33S47"].find(FIND_HOSTILE_CREEPS);
/*
if (enemies.length > 0) {
  Game.spawns["Spawn1"].memory.enemies[Game.time.toString()] = {
    count: enemies.length,
    time: new Date().toLocaleString("en-AU", {
      timeZone: "Australia/Melbourne",
      dateStyle: "short",
      timeStyle: "short",
    }),
    enemies: enemies,
  };
}
*/
let enemiesNoInTheSafeZone = Game.rooms["E33S47"].find(FIND_HOSTILE_CREEPS, {
  filter: (creep) => {
    // Define the area you want to exclude
    let x1 = 1,
      y1 = 37,
      x2 = 35,
      y2 = 49;

    // Check if the creep is outside the area
    return !(
      creep.pos.x >= x1 &&
      creep.pos.x <= x2 &&
      creep.pos.y >= y1 &&
      creep.pos.y <= y2
    );
  },
});

// ###### SPAWN CREEPS HERE ######

// Spawn Lemergium compressor
// Will sawn if there are Lemergium to transfer to factory OR Lemergium bars needs to transfer to terminal (only if factory is done manufacturing Lemergium bars)
if (
  //   Game.rooms["E33S47"].find(FIND_MINERALS)[0].mineralAmount == 0 &&
  roomStorage &&
  roomFactory &&
  ((roomFactory.store.getUsedCapacity(RESOURCE_LEMERGIUM_BAR) > 700 &&
    (roomFactory.store.getUsedCapacity(RESOURCE_LEMERGIUM) < 500 ||
      roomFactory.store.getUsedCapacity(RESOURCE_ENERGY)) < 200) ||
    roomStorage.store.getUsedCapacity(RESOURCE_LEMERGIUM) > 10000) &&
  roomStorage.store.getUsedCapacity(RESOURCE_ENERGY) > 80000 &&
  utils.roleCount(utils.ROLES.LEMERGIUM_COMPRESSOR.role) < 1
) {
  console.log("Spawning Lemergium compressor soon");
  utils.spawnCreep({
    role: utils.ROLES.LEMERGIUM_COMPRESSOR.role,
    body: utils.ROLES.LEMERGIUM_COMPRESSOR.body,
  });
}

// Spawn Seller (on sale resources delivery creep)
const isTransferRequired = Object.keys(terminalResourcesGoal).some(
  (resource) => {
    return (
      roomTerminal.store.getUsedCapacity(resource) <
        terminalResourcesGoal[resource] && roomStorage.store[resource] > 500
    );
  }
);

if (isTransferRequired && utils.roleCount(utils.ROLES.SELLER.role) < 1) {
  console.log("Spawning Lemergium compressor soon");
  utils.spawnCreep({
    role: utils.ROLES.SELLER.role,
    body: utils.ROLES.SELLER.body,
  });
}

// Spawn Builders
if (utils.roleCount(utils.ROLES.BUILDER.role) < 1) {
  const ConstructionSites = Game.rooms["E33S47"].find(FIND_CONSTRUCTION_SITES);
  const storage = roomStorage;

  if (
    ConstructionSites.length > 0 &&
    storage.store.getUsedCapacity(RESOURCE_ENERGY) > 60000
  ) {
    console.log(
      "Spawning builder soon, storage:",
      storage.store.getUsedCapacity(RESOURCE_ENERGY)
    );
    utils.spawnCreep({
      role: utils.ROLES.BUILDER.role,
      body: utils.ROLES.BUILDER.body,
    });
  }
}

// Spawn Upgraders
if (utils.roleCount(utils.ROLES.UPGRADER.role) < 1) {
  console.log("Spawning upgrader soon");
  utils.spawnCreep({
    role: utils.ROLES.UPGRADER.role,
    body: utils.ROLES.UPGRADER.body,
  });
}

// Spawn scouts
if (utils.roleCount(utils.ROLES.SCOUT.role) < 0) {
  console.log("Spawning scout soon");
  utils.spawnCreep({
    role: utils.ROLES.SCOUT.role,
    body: utils.ROLES.SCOUT.body,
  });
}

// Spawn battery guy
if (
  utils.roleCount(utils.ROLES.BATTERY_GUY.role) < 1 &&
  roomStorage.store.getUsedCapacity() > roomStorage.store.getCapacity() * 0.8
) {
  console.log("Spawning good guy soon");
  utils.spawnCreep({
    role: utils.ROLES.BATTERY_GUY.role,
    body: utils.ROLES.BATTERY_GUY.body,
  });
}

// Spawn room worker (remote)
if (
  utils.roleCount(utils.ROLES.CLAIMER.role) < 0 
) {
  console.log("Spawning claimer soon");
  utils.spawnCreep({
    role: utils.ROLES.CLAIMER.role,
    body: utils.ROLES.CLAIMER.body,
  });
}


// Spawn room worker (remote)
if (
  utils.roleCount(utils.ROLES.ROOM_WORKER.role) < 3 &&
  utils.roleCount(utils.ROLES.SMALL_CLAIMER.role) === 0
) {
  console.log("Spawning room worker soon");
  utils.spawnCreep({
    role: utils.ROLES.ROOM_WORKER.role,
    body: utils.ROLES.ROOM_WORKER.body,
  });
}

// Spawn collector
if (utils.roleCount(utils.ROLES.COLLECTOR.role) < 0) {
  console.log("Spawning collector soon");
  utils.spawnCreep({
    role: utils.ROLES.COLLECTOR.role,
    body: utils.ROLES.COLLECTOR.body,
    spawn: "SpawnBottom1",
  });
}

// Spawn small claimer in small room
if (utils.roleCount(utils.ROLES.SMALL_CLAIMER.role) < 0) {
  console.log("Spawning small claimer soon");
  utils.spawnCreep({
    role: utils.ROLES.SMALL_CLAIMER.role,
    body: utils.ROLES.SMALL_CLAIMER.body,
    spawn: "SpawnBottom1",
  });
}

// Spawn Miners (down)
if (utils.roleCount(utils.ROLES.MINER.role) < 1) {
  console.log("Spawning miner soon");
  utils.spawnCreep({
    role: utils.ROLES.MINER.role,
    body: utils.ROLES.MINER.body,
  });
}

// Spawn Miners(1) (up)
if (utils.roleCount(utils.ROLES.MINER1.role) < 1) {
  console.log("Spawning miner soon");
  utils.spawnCreep({
    role: utils.ROLES.MINER1.role,
    body: utils.ROLES.MINER1.body,
  });
}

// Spawn Attacker1 (room E33S47)
if (
  utils.roleCount(utils.ROLES.DEFENDER.role) < enemiesNoInTheSafeZone.length &&
  utils.roleCount(utils.ROLES.DEFENDER.role) < 3
) {
  let enemiesNoInTheSafeZone = Game.rooms["E33S47"].find(FIND_HOSTILE_CREEPS);
  if (enemiesNoInTheSafeZone.length > 0) {
    console.log("Spawning defender soon");
    utils.spawnCreep({
      role: utils.ROLES.DEFENDER.role,
      body: utils.ROLES.DEFENDER.body,
    });
  }
}

// Spawn Low Tower Loader (deliver energy to the low towers only)
if (utils.roleCount(utils.ROLES.LOW_TOWER_LOADER.role) < 1) {
  console.log("Spawning low tower loader");
  utils.spawnCreep({
    role: utils.ROLES.LOW_TOWER_LOADER.role,
    body: utils.ROLES.LOW_TOWER_LOADER.body,
  });
}

// Spawn mineral transporter
if (
  container &&
  container.store.getUsedCapacity(RESOURCE_LEMERGIUM) > 0 &&
  utils.roleCount(utils.ROLES.MINERAL_TRANSPORTER.role) < 3
) {
  console.log("Spawning mineral transporter soon");
  utils.spawnCreep({
    role: utils.ROLES.MINERAL_TRANSPORTER.role,
    body: utils.ROLES.MINERAL_TRANSPORTER.body,
  });
}

// Spawn mineral miner
const mineral = Game.rooms["E33S47"].find(FIND_MINERALS)[0];
if (
  mineral.mineralAmount > 0 &&
  utils.roleCount(utils.ROLES.MINERAL_MINER.role) < 3
) {
  console.log("Spawning mineral miner soon");
  utils.spawnCreep({
    role: utils.ROLES.MINERAL_MINER.role,
    body: utils.ROLES.MINERAL_MINER.body,
  });
}

// Spawn Fixers (deliver energy to the upper tower, upgrade container, storage, and fill spawn and extensions)
if (utils.roleCount(utils.ROLES.FIXER.role) < 1) {
  console.log("Spawning fixer soon");
  utils.spawnCreep({
    role: utils.ROLES.FIXER.role,
    body: utils.ROLES.FIXER.body,
  });
}

// Tower Top logic
let towerTop = Game.structures["65e773838793133539cfc1f7"];

if (towerTop) {
  // Find hostile creeps
  let enemies = towerTop.room.find(FIND_HOSTILE_CREEPS);

  // If there are enemies, attack the first one
  // SWITCHED OFF! TOWER WILL NOT ATTACK ENEMIES! (remove false to enable attack again as first priority)
  if (false && enemies.length > 0) {
    console.log("Attacking enemy: ", enemies[0].pos);
    towerTop.attack(enemies[0]);
  } else {
    // If there are no enemies, find creeps that need healing
    let creepsNeedHeal = towerTop.room.find(FIND_MY_CREEPS, {
      filter: (creep) => creep.hits < creep.hitsMax,
    });

    // If there are creeps that need healing, heal the first one
    if (creepsNeedHeal.length > 0) {
      console.log("Healing creep: ", creepsNeedHeal[0].pos);
      towerTop.heal(creepsNeedHeal[0]);
    } else {
      // If there are no creeps that need healing, find structures to repair
      let structuresToFix = towerTop.room.find(FIND_STRUCTURES, {
        filter: (structure) =>
          structure.hits < structure.hitsMax &&
          ((structure.hits < 30000 && structure.pos.y <= 27) ||
            structure.structureType === STRUCTURE_CONTAINER), // keep this low till you build the checkmate board
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
        towerTop.repair(structureWithLeastHits);
      }
    }
  }
}

// Tower Bottom 1 logic
let towerBottom = Game.structures["65ed1f8a9e6aaf67eaebd2ed"];

if (towerBottom) {
  // Find closest hostile creep
  let closestEnemy = towerBottom.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

  // If there are enemies, attack the first one
  if (closestEnemy) {
    console.log("Attacking enemy: ", closestEnemy.pos);
    towerBottom.attack(closestEnemy); //
  } else {
    // If there are no enemies, find creeps that need healing
    let creepsNeedHeal = towerBottom.room.find(FIND_MY_CREEPS, {
      filter: (creep) => creep.hits < creep.hitsMax,
    });

    // If there are creeps that need healing, heal the first one
    if (creepsNeedHeal.length > 0) {
      console.log("Healing creep: ", creepsNeedHeal[0].pos);
      towerBottom.heal(creepsNeedHeal[0]);
    } else {
      // If there are no creeps that need healing, find structures to repair
      let structuresToFix = towerBottom.room.find(FIND_STRUCTURES, {
        filter: (structure) =>
          (structure.hits < structure.hitsMax &&
            structure.hits < 30000 &&
            structure.pos.y > 27) ||
          (structure.hits < structure.hitsMax &&
            structure.hits < 2350000 && // TMP restriction to avoid over-repairing
            structure.pos.x > 7 &&
            structure.pos.x < 13 &&
            structure.pos.y == 29) ||
          (structure.hits < structure.hitsMax &&
            structure.hits < 2350000 &&
            structure.pos.x == 12 &&
            structure.pos.y > 29 &&
            structure.pos.y < 32),
      });

      if (towerBottom.store.getUsedCapacity(RESOURCE_ENERGY) > 650) {
        console.log("structuresToFix: ", structuresToFix.length);

        let structureWithLeastHits = structuresToFix.reduce(
          (least, structure) => {
            return least && least.hits < structure.hits ? least : structure;
          },
          null
        );

        // If there are structures that need repairing, repair the one with the least hits
        if (structureWithLeastHits) {
          console.log("Repairing structure: ", structureWithLeastHits.pos);
          towerBottom.repair(structureWithLeastHits);
        }
      }
    }
  }
}
// Tower Bottom 2 logic
let towerBottom2 = Game.structures["66055b9a130cdfc8e7e990e9"];

if (towerBottom2) {
  // Find closest hostile creep
  let closestEnemy = towerBottom.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

  // If there are enemies, attack the first one
  if (closestEnemy) {
    console.log("Attacking enemy: ", closestEnemy.pos);
    towerBottom2.attack(closestEnemy); //
  } else {
    // If there are no enemies, find creeps that need healing
    let creepsNeedHeal = towerBottom2.room.find(FIND_MY_CREEPS, {
      filter: (creep) => creep.hits < creep.hitsMax,
    });

    // If there are creeps that need healing, heal the first one
    if (creepsNeedHeal.length > 0) {
      console.log("Healing creep: ", creepsNeedHeal[0].pos);
      towerBottom2.heal(creepsNeedHeal[0]);
    } else {
      // If there are no creeps that need healing, find structures to repair
      let structuresToFix = towerBottom2.room.find(FIND_STRUCTURES, {
        filter: (structure) =>
          (structure.hits < structure.hitsMax &&
            structure.hits < 30000 &&
            structure.pos.y > 27) ||
          (structure.hits < structure.hitsMax &&
            structure.hits < 2350000 && // TMP restriction to avoid over-repairing
            structure.pos.x > 7 &&
            structure.pos.x < 13 &&
            structure.pos.y == 29) ||
          (structure.hits < structure.hitsMax &&
            structure.hits < 2350000 &&
            structure.pos.x == 12 &&
            structure.pos.y > 29 &&
            structure.pos.y < 32),
      });

      if (towerBottom2.store.getUsedCapacity(RESOURCE_ENERGY) > 650) {
        console.log("structuresToFix: ", structuresToFix.length);

        let structureWithLeastHits = structuresToFix.reduce(
          (least, structure) => {
            return least && least.hits < structure.hits ? least : structure;
          },
          null
        );

        // If there are structures that need repairing, repair the one with the least hits
        if (structureWithLeastHits) {
          console.log("Repairing structure: ", structureWithLeastHits.pos);
          towerBottom2.repair(structureWithLeastHits);
        }
      }
    }
  }
}

// mine links logic
try {
  let linkTop = Game.structures["660556832f2f19a3f2584f46"];
  let linkBottom = Game.structures["660544f57708c87157ef3003"];
  let linkStorage = Game.structures["66052e496528663bb98da1b8"];
  let linkTowers = Game.structures["660941258e7fe73ade42ef29"];

  if (linkBottom && linkStorage) {
    if (linkBottom.store.getUsedCapacity(RESOURCE_ENERGY) >= 500) {
      if (linkTowers.store.getUsedCapacity(RESOURCE_ENERGY) < 500) {
        linkBottom.transferEnergy(linkTowers);
      } else {
        linkBottom.transferEnergy(linkStorage);
      }
    }
  }

  if (linkTop && linkStorage) {
    if (linkTop.store.getUsedCapacity(RESOURCE_ENERGY) >= 500) {
      if (linkTowers.store.getUsedCapacity(RESOURCE_ENERGY) < 500) {
        linkTop.transferEnergy(linkTowers);
      } else {
        linkTop.transferEnergy(linkStorage);
      }
    }
  }
} catch {
  console.log("Error in link transfer");
}

for (let i in Game.creeps) {
  let creep = Game.creeps[i];
  // Reveal all creep roles
  if (revealCreeps) {
    Game.creeps[i].say(Game.creeps[i].memory.role);
  }

  // Role "miner" bottom job description
  if (Game.creeps[i].memory.role == "miner") {
    let creep = Game.creeps[i];

    // Check for dropped resources in the current position
    let droppedResource = creep.pos.lookFor(LOOK_RESOURCES);
    if (droppedResource.length > 0 && creep.store.getFreeCapacity() > 0) {
      creep.pickup(droppedResource[0]);
    } else {
      // If container is not empty, AND linkBottom is not full, withdraw energy from it and transfer to the link
      let linkBottom = Game.structures["660544f57708c87157ef3003"];
      let containerRight = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) =>
          s.structureType == STRUCTURE_CONTAINER &&
          s.store.getUsedCapacity(RESOURCE_ENERGY) > 0 &&
          s.pos.x == 32 &&
          s.pos.y == 21 &&
          linkBottom.store[RESOURCE_ENERGY] < 700,
      });
      if (containerRight) {
        console.log(
          "containerRight: ",
          containerRight.store.getUsedCapacity(RESOURCE_ENERGY)
        );
      }

      if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0 && containerRight) {
        if (
          creep.withdraw(containerRight, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
        ) {
          creep.moveTo(containerRight);
        }
        continue;
      } else {
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) >= 16) {
          const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
          const harvestResult = creep.harvest(source);
          if (harvestResult != OK) {
            creep.moveTo(31, 20);
          }
        } else {
          let linkBottom = Game.structures["660544f57708c87157ef3003"];

          if (
            linkBottom &&
            linkBottom.store.getFreeCapacity(RESOURCE_ENERGY) >= 100
          ) {
            const transferResult = creep.transfer(linkBottom, RESOURCE_ENERGY);
            if (transferResult == ERR_NOT_IN_RANGE) {
              creep.moveTo(31, 20);
            }
            continue;
          }

          let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) =>
              s.structureType == STRUCTURE_CONTAINER &&
              s.store.getUsedCapacity(RESOURCE_ENERGY) <
                s.store.getCapacity(RESOURCE_ENERGY),
          });

          if (container) {
            const transferResult = creep.transfer(container, RESOURCE_ENERGY);
            if (transferResult == ERR_NOT_IN_RANGE) {
              creep.moveTo(31, 20);
            }
            if (transferResult == ERR_NOT_ENOUGH_ENERGY) {
              creep.memory.isLoadingEnergy = true;
            }
          }
        }
      }
    }
  }

  // Role "miner1" (Top) job description
  if (Game.creeps[i].memory.role == "miner1") {
    let creep = Game.creeps[i];

    // Check for dropped resources in the current position
    let droppedResource = creep.pos.lookFor(LOOK_RESOURCES);
    if (droppedResource.length > 0 && creep.store.getFreeCapacity() > 0) {
      creep.pickup(droppedResource[0]);
    } else {
      // Add your code here for when no ruin is found
      // If the top container is not empty, withdraw energy from it and transfer to the link
      let linkTop = Game.structures["660556832f2f19a3f2584f46"];
      let containerTop = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) =>
          s.structureType == STRUCTURE_CONTAINER &&
          s.store.getUsedCapacity(RESOURCE_ENERGY) > 0 &&
          s.pos.x == 30 &&
          s.pos.y == 11,
      });

      if (
        creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0 &&
        containerTop &&
        linkTop.store.getFreeCapacity(RESOURCE_ENERGY) > 100
      ) {
        const withdrawResult = creep.withdraw(containerTop, RESOURCE_ENERGY);
        if (withdrawResult == ERR_NOT_IN_RANGE) {
          creep.moveTo(containerTop);
        }
      } else {
        if (
          creep.memory.isLoadingEnergy ||
          creep.store.getFreeCapacity(RESOURCE_ENERGY) >= 16
        ) {
          const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
          const harvestResult = creep.harvest(source);
          console.log("miner top harvestResult: ", harvestResult);
          if (harvestResult != OK) {
            creep.moveTo(31, 12);
          } else if (harvestResult == OK) {
            if (
              creep.store[RESOURCE_ENERGY] ==
              creep.store.getCapacity(RESOURCE_ENERGY)
            ) {
              creep.memory.isLoadingEnergy = false;
            }
          }
        } else {
          // fill the link first
          let linkTop = Game.structures["660556832f2f19a3f2584f46"];
          if (
            linkTop &&
            linkTop.store.getFreeCapacity(RESOURCE_ENERGY) >= 100
          ) {
            const transferResult = creep.transfer(linkTop, RESOURCE_ENERGY);
            if (transferResult == ERR_NOT_IN_RANGE) {
              creep.moveTo(31, 12);
            }
            continue;
          }

          let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) =>
              s.structureType == STRUCTURE_CONTAINER &&
              s.store.getUsedCapacity(RESOURCE_ENERGY) <
                s.store.getCapacity(RESOURCE_ENERGY),
          });

          if (container) {
            const transferResult = creep.transfer(container, RESOURCE_ENERGY);
            if (transferResult == ERR_NOT_IN_RANGE) {
              // Always stay next to the top container
              creep.moveTo(31, 12);
            }
            if (transferResult == ERR_NOT_ENOUGH_ENERGY) {
              creep.memory.isLoadingEnergy = true;
            }
          }
        }
      }
    }
  }

  // Role "fixer" job description
  if (creep.memory.role === "fixer") {
    roleFixer.run(creep);
  }

  // Role "room worker" job description
  if (creep.memory.role === "roomWorker") {
    roleRoomWorker.run(creep.name);
  }

  // Role "claimer" job description
  if (creep.memory.role === "claimer") {
    roleRoomClaimer.run(creep.name);
  }

  // Role "small claimer" job description
  if (creep.memory.role === "SmallClaimer") {
    roleRoomWorker.run(creep.name);
  }

  // Role "collector" job description
  if (creep.memory.role === "collector") {
    roleCollector.run(creep.name);
  }

  // run the E33S48 towers
  roleTower.run("6640c689068fbd0f96d12030");
  roleTower.run("6640caf5be38cf78776bc7a9");

  // Role  "builder" job description
  if (Game.creeps[i].memory.role == "builder") {
    let creep = Game.creeps[i];
    let timeToLive = creep.ticksToLive;
    console.log("timeToLive: ", timeToLive);
    if (timeToLive && timeToLive < 100) {
      let spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS);
      if (spawn && spawn.renewCreep(creep) == ERR_NOT_IN_RANGE) {
        creep.moveTo(spawn);
      }

      continue;
    }

    // renew builder so that it does not die when on a far away mission
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
      if (creep.ticksToLive > 1000) {
        creep.memory.isRenewing = false;
      }
      if (creep.ticksToLive < 800 || creep.memory.isRenewing) {
        creep.memory.isRenewing = true;
        const spawn = Game.spawns["Spawn1"];
        if (spawn.renewCreep(creep) === ERR_NOT_IN_RANGE) {
          creep.moveTo(spawn);
        }
        continue;
      }
    }

    let constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

    if (creep.store[RESOURCE_ENERGY] == 0 && constructionSite) {
      // If empty, find closest container with at least 400 energy and withdraw energy
      let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) =>
          s.structureType == STRUCTURE_CONTAINER &&
          s.store.getUsedCapacity(RESOURCE_ENERGY) > 1800, // basically never, use storage instead
      });

      if (container) {
        const withdrawResult = creep.withdraw(container, RESOURCE_ENERGY);
        if (withdrawResult == ERR_NOT_IN_RANGE) {
          creep.moveTo(container);
        }
      } else {
        // If no container with energy, find closest storage and withdraw energy
        let storage = roomStorage;
        if (storage) {
          const withdrawResult = creep.withdraw(storage, RESOURCE_ENERGY);
          if (withdrawResult == ERR_NOT_IN_RANGE) {
            creep.moveTo(storage);
          }
        }
      }
    } else {
      // If not empty, find closest construction site and build it
      if (constructionSite) {
        const buildResult = creep.build(constructionSite);
        if (buildResult == ERR_NOT_IN_RANGE) {
          creep.moveTo(constructionSite);
        }
      } else {
        //if nothing to construct transfer rest of energy to storage
        let storage = roomStorage;
        if (storage && creep.store[RESOURCE_ENERGY] > 0) {
          const transferResult = creep.transfer(storage, RESOURCE_ENERGY);
          if (transferResult == ERR_NOT_IN_RANGE) {
            creep.moveTo(storage);
          }
        } else {
          // recycle with the closest spawn
          let spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS);
          if (spawn) {
            const recycleResult = spawn.recycleCreep(creep);
            if (recycleResult == ERR_NOT_IN_RANGE) {
              creep.moveTo(spawn);
            }
          }
        }
      }
    }
  }

  //Role Upgrader: Job description:
  if (creep.memory.role == "upgrader") {
    roleUpgrader.run(creep);
  }

  //Role scout: Job description:
  if (creep.memory.role == "scout") {
    roleScout.run(creep);
  }

  //Role battery guy: Job description:
  if (creep.memory.role == "batteryGuy") {
    roleBatteryGuy.run(creep.name);
  }

  // Role defender
  if (creep.memory.role == utils.ROLES.DEFENDER.role) {
    roleDefender.run(creep);
  }

  // Role Low Tower Loader
  if (creep.memory.role == utils.ROLES.LOW_TOWER_LOADER.role) {
    roleLowTowerLoader.run(creep.name);
  }

  // Role mineral miner
  if (creep.memory.role == utils.ROLES.MINERAL_MINER.role) {
    roleMineralMiner.run(creep.name, container);
  }

  // Role mineral transporter
  if (creep.memory.role == utils.ROLES.MINERAL_TRANSPORTER.role) {
    roleMineralTransporter.run(creep.name, container);
  }

  // Role Lemergium Compressor
  if (creep.memory.role == utils.ROLES.LEMERGIUM_COMPRESSOR.role) {
    roleLemergiumCompressor.run(
      creep.name,
      roomFactory,
      roomStorage,
      roomTerminal
    );
  }

  // Role Seller
  if (creep.memory.role == utils.ROLES.SELLER.role) {
    roleSeller.run(
      creep.name,
      roomTerminal,
      roomStorage,
      terminalResourcesGoal
    );
  }
}

// Market logic

// console.log(
//   "Game.market",
//   JSON.stringify(
//     Game.market.getAllOrders({
//       type: ORDER_BUY,
//       resourceType: RESOURCE_LEMERGIUM_BAR,
//     }),
//     undefined,
//     2
//   )
// );

if (Game.cpu.bucket >= 10000) {
  Game.cpu.generatePixel();
}

if (Game.cpu.bucket >= 9970) {
  let orders = Game.market.getAllOrders(
    (order) =>
      order.type == ORDER_BUY &&
      order.resourceType == RESOURCE_LEMERGIUM_BAR &&
      order.price >= 191 &&
      order.amount >= 1000
  );

  if (orders.length == 0) {
    console.log("No good deals for Lemergium bars found");
  } else {
    Memory.order = orders[0];
  }

  for (let order of orders) {
    console.log(
      `Order ID: ${order.id}, Price: ${order.price}, Amount: ${order.amount}`
    );
  }
}

// Will try to make a deal to sell some lemergium bars if there is an order object in Memory
if (Memory.order && Memory.order.id) {
  console.log("Lets perform deal with order ID: ", Memory.order.id);
  let orderId = Memory.order.id; // replace with your order ID
  let amount = 1000; // replace with the amount you want to buy

  let result = Game.market.deal(orderId, amount, roomTerminal.room.name);

  if (result == OK) {
    console.log(`Market deal made.`);
    Memory.PastOrders = Memory.PastOrders || [];
    Memory.PastOrders.push(Memory.order);
    Memory.PastOrders[Memory.PastOrders.length - 1].dealAmount = amount;
    delete Memory.order;
  } else {
    console.log(`Failed to make market deal: ${result}`);
    delete Memory.order;
  }
}

// Factory produce batterys
if (
  !roomFactory.cooldown &&
  roomFactory.store.getUsedCapacity(RESOURCE_ENERGY) >= 600
) {
  console.log("factory produce battery", roomFactory.produce(RESOURCE_BATTERY));
}

// Factory produce Lemergium bars
if (
  !roomFactory.cooldown &&
  roomFactory.store.getUsedCapacity(RESOURCE_LEMERGIUM) >= 500 &&
  roomFactory.store.getUsedCapacity(RESOURCE_ENERGY) >= 200
) {
  console.log(
    "factory produce bars of Lemergium",
    roomFactory.produce(RESOURCE_LEMERGIUM_BAR)
  );
}

// Use this to calculate body cost and Move to other parts ratio:
console.log(
  utils.ROLES.SMALL_CLAIMER.role,
  ": ",
  utils.calculateBodyCost({
    body: utils.ROLES.SMALL_CLAIMER.body,
  })
);

// recycle creep
try {
  const creepToRecycle = Game.creeps["mineralMiner#57344542"];
  const spawn = Game.spawns["Spawn1"];
  if (
    creepToRecycle &&
    spawn.recycleCreep(creepToRecycle) == ERR_NOT_IN_RANGE
  ) {
    creepToRecycle.moveTo(spawn);
  }
} catch {
  console.log("Failed to recycle creep");
}

// Clear Memory from dead creeps
for (let name in Memory.creeps) {
  if (!Game.creeps[name]) {
    delete Memory.creeps[name];
    console.log("Clearing non-existing creep memory:", name);
  }
}

console.log(`CPU Bucket: ${Game.cpu.bucket}`);
