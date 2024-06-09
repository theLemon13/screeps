const roleScout = {
  run: (creep) => {
    // these are the location A and B. A is were you want it to go and B is the closeted point from A to spawn
    let LocationA = { x: 24, y: 10 };
    let LocationB = { x: 38, y: 12 };

    // if is done scouting move to the spawn
    if (creep.memory.isDoneScouting) {
        let spawn = Game.spawns["Spawn1"]
        let recycleResult = spawn.recycleCreep(creep);
        if (recycleResult == ERR_NOT_IN_RANGE) {
            creep.moveTo(spawn, {visualizePathStyle:{lineStyle: "dashed"}});
        }
      return
    }

    // if creep at location A set is done scouting to true and move once then terminate
    if (creep.pos.x == LocationA.x && creep.pos.y == LocationA.y) {
        console.log("____updating memory")
      creep.memory.isDoneScouting = true;
      return;
    }

    // if not done scouting move to location A
    if (
      !creep.memory.isDoneScouting ||
      creep.memory.isDoneScouting == undefined
    ) {
      creep.moveTo(LocationA.x, LocationA.y);
      return;
    }




    // if at the spawn recycle it self
    if (creep.pos.x == LocationB.x && creep.pos.y == LocationB.y) {
      
    }
  },
};

module.exports = roleScout;

