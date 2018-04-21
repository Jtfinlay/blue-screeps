import ConstructionPlanner from './ConstructionPlanner';
import CreepModel from './models/Creep';
import { ErrorMapper } from './utils/ErrorMapper';
import profiler from 'screeps-profiler';
import RoomUtils from './utils/RoomUtils';
import TaskList from './Tasklist';
import { Task } from './tasks';
import GameUtils from 'utils/GameUtils';

profiler.enable();

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
    profiler.wrap(function() {
        GameUtils.reset();

        // Automatically delete memory of missing creeps
        for (const name in Memory.creeps) {
            if (!(name in Game.creeps)) {
                delete Memory.creeps[name];
            }
        }

        ConstructionPlanner.process(RoomUtils.firstRoom());

        const remainingTasks: Task[] = TaskList.process();

        // for (const name in Game.spawns) {
        //     const spawn = Game.spawns[name];
        //     if (spawn.energy >= 200 && remainingTasks.filter(t => t.type !== 'deliverenergy').length > 0) {
        //         spawn.createCreep( [ WORK, CARRY, MOVE], 'Creep'+Game.time);
        //     }
        // }
    });
});