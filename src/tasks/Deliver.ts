import CreepModel from 'models/Creep';
import { Task, DeliverEnergyTaskType, TaskType } from './index';
import GameUtils from 'utils/GameUtils';
import StructureUtils, { StructureType } from 'utils/Structure';
import profiler from 'screeps-profiler';
import RoomUtils from '../utils/RoomUtils';

export default class DeliverTask implements Task {
    private structure: StructureType;
    private maxWorkers: number = 4;

    public type: TaskType = 'deliverenergy';

    constructor(structureId: string) {
        this.structure = GameUtils.getStructureById(structureId);
    }

    public get priority(): number {
        switch (this.structure.structureType) {
            case STRUCTURE_CONTROLLER:
                return 70;
            case STRUCTURE_SPAWN:
            case STRUCTURE_EXTENSION:
                return this.spawnStructurePriority;
            case STRUCTURE_CONTAINER:
                // todo - figure out priority for each.
                return 65;
            default:
                console.log('unknown priority to assigned for deliverTask of ' + this.structure.structureType);
                return 60;
        }
    }

    public get targetId(): string {
        return this.structure.id;
    }

    public get Structure(): StructureType {
        return this.structure;
    }

    public chooseCreep(creeps: CreepModel[]): CreepModel | null {
        const sorted = creeps.sort(c => PathFinder.search(c.pos, this.structure.pos).cost)
        for (let name in sorted) {
            let creep: CreepModel = sorted[name];
            if (this.canBePerformedBy(creep)) {
                return creep;
            }
        }
        return null;
    }

    public canBePerformedBy(creep: CreepModel): boolean {
        if (this.structure instanceof StructureController) {
            return creep.carry.energy > 0;
        }

        return (creep.carry.energy > 0) 
            && (StructureUtils.getEnergy(this.structure) < StructureUtils.getEnergyCapacity(this.structure));
    }

    public perform(creep: CreepModel): boolean {
        if (creep.transfer(this.structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(this.structure, {visualizePathStyle: {stroke: '#ffffff'}});
        }
        return true;
    }

    public spawnCreep(): BodyPartConstant[] | null {
        if (this.totalWorkers() < this.maxWorkers) {
            return [ WORK, CARRY, MOVE];
        }
        return null;
    }

    private totalWorkers(): number {
        return GameUtils.Creeps.filter(c => c.taskTarget === this.type).length;
    }

    private get spawnStructurePriority(): number {
        const minPriority = 40;
        const maxPriority = 100;

        // If there are 10+ high priority jobs, then highest priority
        const creepsNeeded = RoomUtils.getNumberOfCreepsNeededLastTick(this.structure.room);
        let valuePriority = 100*(1 - creepsNeeded/20);
        valuePriority = Math.min(maxPriority, valuePriority);
        valuePriority = Math.max(minPriority, valuePriority);

        return valuePriority;
    }
}
profiler.registerClass(DeliverTask, 'deliverTask');