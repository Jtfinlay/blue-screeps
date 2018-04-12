import CreepRoles from './creepRole';

module.exports.loop = () => {
    console.log(`Current game tick is ${Game.time}`);
    for(var name in Game.rooms) {
        console.log('Room "' + name + '" has ' + Game.rooms[name].energyAvailable + ' energy');
    }

    // Automatically delete memory of missing creeps
    for (const name in Memory.creeps) {
      if (!(name in Game.creeps)) {
        delete Memory.creeps[name];
      }
    }

    for (const name in Game.spawns) {
        const spawn = Game.spawns[name];
        if (spawn.energy >= 200) {
            spawn.createCreep( [ WORK, CARRY, MOVE], 'Creep'+Game.time);
        }
    }

    for (const name in Game.creeps){
        const creep = Game.creeps[name];
        CreepRoles.run(creep);
    }
};