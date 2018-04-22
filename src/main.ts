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

        for (const name in Game.spawns) {
            const spawn = Game.spawns[name];

            const tasks = remainingTasks.filter(t => t.spawnCreep() !== null);
            RoomUtils.setNumberOfCreepsNeededLastTick(spawn.room, tasks.length);
            if (tasks.length <= 0) {
                break;
            }
            if (GameUtils.Creeps.find(creep => !creep.task) !== undefined) {
                RoomUtils.setLastJoblessCreepTick(spawn.room, Game.time);
                break;
            }

            if (Game.time - RoomUtils.getLastJoblessCreepTick(spawn.room) < 50) {
                // recently saw a jobless creep - employment should be good
                break;
            }

            const creepBody = tasks[0].spawnCreep();
            
            if ((spawn.energy >= 200) && creepBody !== null) {
                console.log('spawning');
                spawn.createCreep(creepBody, 'Creep'+Game.time);
            }
        }
    });
});