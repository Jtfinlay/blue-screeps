import CreepModel from './models/Creep';
import GameUtils from './utils/GameUtils';
import RoadBuildTask from './tasks/Builder';
import RoomUtils from './utils/RoomUtils';
import SourceModel from './models/Source';
import StructureUtils from './utils/Structure';
import { Task } from './tasks';
import DeliverTask from 'tasks/Deliver';
import GatherTask from 'tasks/Gather';
import profiler from 'screeps-profiler';

class TaskListClass {
    private _taskList: Task[] = [];
    
    public process(): Task[] {
        this.beforeRun();

        const room = RoomUtils.firstRoom();

        let tasks: Task[] = [];
        tasks = tasks.concat(this.createHarvestTasks(room));
        tasks = tasks.concat(this.createBuildTasks(room));
        tasks = tasks.concat(this.createDeliverTasks(room));
        tasks = tasks.concat(this.createGatherTasks(room));
        tasks = this.sortTasksByPriority(tasks);

        const remainingTasks: Task[] = this.assignTasks(tasks);

        this.execute();

        return remainingTasks;
    }

    private beforeRun(): void {
        // First, have all creeps check if their current tasks are valid
        GameUtils.Creeps.forEach(creep => creep.validateTask());
    }

    private createGatherTasks(room: Room): Task[] {
        const unAssignedResources = RoomUtils.findDroppedResourcesInRoom(room)
            .filter(res => 
                undefined === GameUtils.Creeps.find(c => c.taskTarget === res.id))
        return unAssignedResources.map(res => new GatherTask(res.id));
    }

    private createHarvestTasks(room: Room): Task[] {
        const results = RoomUtils.findSourcesInRoom(room).map(source => source.createTasks());
        return [].concat.apply([], results);
    }

    private createDeliverTasks(room: Room): Task[] {
        let tasks: Task[];
        const structures = room.find(FIND_STRUCTURES, {
            filter: (structure: AnyStructure) => {
                return (StructureUtils.isHarvestTarget(structure)
                    && StructureUtils.getEnergy(structure) < StructureUtils.getEnergyCapacity(structure))
            }
        });
        tasks = structures.map(target => new DeliverTask(target.id));
        if (room.controller) {
            tasks = tasks.concat(new DeliverTask(room.controller.id));
        }
        return tasks;
    }

    private createBuildTasks(room: Room): Task[] {
        return room.find(FIND_CONSTRUCTION_SITES).map(site => new RoadBuildTask(site.id));
    }

    private assignTasks(tasks: Task[]): Task[] {
        for (let i=0; i<tasks.length; i++) {
            let task = tasks[i];
            let jobless = GameUtils.Creeps
                .filter(c => !c.task && task.canBePerformedBy(c))
                .sort(c => PathFinder.search(c.pos, task.targetPosition).cost);

            if (jobless.length === 0) {
                continue;
            }
            jobless[0].task = task;

            tasks.splice(i,1);
            i--;
        }

        return tasks;
    }

    private sortTasksByPriority(tasks: Task[]) : Task[] {
        // in other method for easy profiling.
        return tasks.sort((a, b) => a.priority - b.priority);
    }

    private execute(): void {
        // Have creeps execute their tasks
        for (const name in Game.creeps){
            const creep = new CreepModel(Game.creeps[name]);
            creep.run();
        }
    }
}
profiler.registerClass(TaskListClass, 'taskList');

const taskList = new TaskListClass();
export default taskList;