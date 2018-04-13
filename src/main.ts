import CreepModel from './models/Creep';
import { ErrorMapper } from './utils/ErrorMapper';

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {

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
});