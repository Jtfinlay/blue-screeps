import CreepModel from './models/Creep';
import GameUtils from './utils/GameUtils';
import RoomUtils from './utils/RoomUtils';
import SourceModel from './models/Source';
import StructureUtils from './utils/Structure';
import { Task } from './tasks';
import DeliverTask from 'tasks/Deliver';

class TaskListClass {
    private _taskList: Task[] = [];
    
    public process(): Task[] {
        this.beforeRun();

        const room = RoomUtils.firstRoom();

        let tasks: Task[] = this.createSpawnTasks(room);
        tasks = tasks.concat(this.createDeliverTasks(room));

        const remainingTasks: Task[] = this.assignTasks(tasks);

        this.execute();

        return remainingTasks;
    }

    private beforeRun(): void {
        // First, have all creeps check if their current tasks are valid
        GameUtils.Creeps.forEach(creep => creep.validateTask());
    }

    private createSpawnTasks(room: Room): Task[] {
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

    private assignTasks(tasks: Task[]): Task[] {
        for (var i=0; i<tasks.length; i++) {
            let jobless = GameUtils.Creeps.filter(creep => !creep.task);
            for (var name in jobless) {
                var creep: CreepModel = jobless[name];
                if (tasks[i].canBePerformedBy(creep)) {
                    creep.task = tasks[i];
                    tasks.splice(i,1);
                    i--;
                    break;
                }
            }
        }

        return tasks;
    }

    private execute(): void {
        // Have creeps execute their tasks
        for (const name in Game.creeps){
            const creep = new CreepModel(Game.creeps[name]);
            creep.run();
        }
    }
}

const taskList = new TaskListClass();
export default taskList;