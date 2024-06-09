const ROLES = {
  MINER: {
    role: "miner",
    body: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE],
  },
  MINER1: {
    role: "miner1",
    body: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE],
  },

  SMALL_CLAIMER: {
    role: "SmallClaimer",
    body: [
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
    ],
  },

  ROOM_WORKER: {
    role: "roomWorker",
    body: [
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
    ],
  },

  CLAIMER: {
    role: "claimer",
    body: [CLAIM, MOVE],
  },

  MINERAL_TRANSPORTER: {
    role: "mineralTransporter",
    body: [
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
    ],
  },

  FIXER: {
    role: "fixer",
    body: [
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
    ],
  },
  BUILDER: {
    role: "builder",
    body: [
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
    ],
  },

  COLLECTOR: {
    role: "collector",
    body: [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
  },

  BATTERY_GUY: {
    role: "batteryGuy",
    body: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
  },

  UPGRADER: {
    role: "upgrader",
    body: [
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      CARRY,
      CARRY,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
    ],
  },
  MINERAL_MINER: {
    role: "mineralMiner",
    body: [
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      CARRY,
      CARRY,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
    ],
  },
  LOW_TOWER_LOADER: {
    role: "LowTowersLoader",
    body: [CARRY, MOVE],
  },
  DEFENDER: {
    role: "defender",
    body: [
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      RANGED_ATTACK,
      RANGED_ATTACK,
      RANGED_ATTACK,
      RANGED_ATTACK,
      RANGED_ATTACK,
      RANGED_ATTACK,
      RANGED_ATTACK,
      RANGED_ATTACK,
      RANGED_ATTACK,
      RANGED_ATTACK,
    ],
  },
  SCOUT: {
    role: "scout",
    body: [MOVE],
  },
  DISMANTLER: {
    role: "dismantler",
    body: [
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
    ],
  },
  LEMERGIUM_COMPRESSOR: {
    role: "lemergiumCompressor",
    body: [
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
    ],
  },
  SELLER: {
    role: "seller",
    body: [
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
    ],
  },
};
const spawnCreep = ({ role, body, spawn = "Spawn1" }) => {
  const spawnResult = Game.spawns[spawn].spawnCreep(
    body,
    `${role}#${Game.time.toString()}`,
    { memory: { role: role, isLoadingEnergy: true } }
  );

  if (spawnResult === OK) {
    console.log(`Spawning ${role} creep`);
  } else {
    console.log(`Failed to spawn ${role} creep: ${spawnResult}`);
  }
};

const roleCount = (role) =>
  _.filter(Game.creeps, (creep) => creep.memory.role === role).length;

const BODY_PART_COST = {
  move: 50,
  work: 100,
  attack: 80,
  carry: 50,
  heal: 250,
  ranged_attack: 150,
  tough: 10,
  claim: 600,
};
const calculateBodyCost = ({ body }) => {
  let sum = 0;
  let moveParts = 0;
  for (let i in body) {
    sum += BODY_PART_COST[body[i]];
    if (body[i] === "move") {
      moveParts++;
    }
  }
  let ratio = moveParts / (body.length - moveParts);
  return `Body cost: ${sum}, ${
    ratio >= 1 / 2
      ? "with good move body ratio - "
      : "with bad move body ratio - "
  }(${ratio}), body parts: ${body.length}`;
};

function updateTerminalNeeds(resource, amount) {
  const terminalNeeds = Game.spawns["Spawn1"].memory.terminalNeeds;
  if (terminalNeeds.hasOwnProperty(resource)) {
    terminalNeeds[resource] += amount;
    if (terminalNeeds[resource] < 0) {
      terminalNeeds[resource] = 0;
    }
  } else {
    terminalNeeds[resource] = amount;
  }
}
function energyInRoom(room) {
  const structures = Game.rooms[room].find(FIND_MY_STRUCTURES, {
    filter: (structure) => {
      return (
        structure.structureType == STRUCTURE_EXTENSION ||
        structure.structureType == STRUCTURE_SPAWN
      );
    },
  });

  let totalEnergy = 0;
  for (let structure of structures) {
    totalEnergy += structure.store[RESOURCE_ENERGY];
  }

  console.log(`Total energy in spawns and extensions: ${totalEnergy}`);
}
// function buyResource(resourceType, amount) {

//   const terminal = Game.rooms["E33S47"].terminal;

//   // Find the cheapest order for the specified resource
//   const orders = Game.market.getAllOrders({ type: ORDER_SELL, resourceType: resourceType });
//   orders.sort((a, b) => a.price - b.price);

//   if (orders.length > 0) {
//     const order = orders[0];

//     // Check if the terminal has enough credits and capacity for the resource

//     if (terminal && terminal.store.getFreeCapacity() >= amount && Game.market.credits >= order.price * amount) {
//       const result = Game.market.deal(order.id, amount, order.roomName);

//       if (result === OK) {
//         console.log(`Bought ${amount} of ${resourceType} for ${order.price * amount} credits`);
//       } else {
//         console.log(`Failed to buy resource: ${result}`);
//       }
//     } else {
//       console.log('Not enough credits or terminal capacity');
//     }
//   } else {
//     console.log(`No sell orders for ${resourceType}`);
//   }
// }

module.exports = {
  spawnCreep,
  roleCount,
  calculateBodyCost,
  ROLES,
  updateTerminalNeeds,
  energyInRoom,
  //  buyResource,
};

// To execute in console:
// require("utils").updateTerminalNeeds()
// require("utils").buyResource(RESOURCE_POWER , [amount]
// require("utils").energyInRoom("E33S48")
