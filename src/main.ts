import CreepModel from './model-creep';

module.exports.loop = () => {
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
        const creep = new CreepModel(Game.creeps[name]);
        creep.run();
    }
};