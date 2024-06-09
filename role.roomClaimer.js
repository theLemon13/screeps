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

      const controller = creep.room.controller;
      // check if room is ours, and recycle if it is
      if (controller.my) {
        const mySpawn = creep.room.find(FIND_MY_SPAWNS)[0];
        if (mySpawn.recycleCreep(creep) === ERR_NOT_IN_RANGE) {
          creep.moveTo(mySpawn);
          return;
        }
      }

      // claim room with claim parts
      if (controller) {
        if (creep.claimController(controller) === ERR_NOT_IN_RANGE) {
          creep.moveTo(controller);
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
