import CreepModel from 'models/Creep';
import { Task, GatherResourceTaskType, TaskType } from './index';
import GameUtils from 'utils/GameUtils';
import RoomUtils from 'utils/RoomUtils';
import StructureUtils, { StructureType } from 'utils/Structure';
import profiler from 'screeps-profiler';

export default class GatherTask implements Task {
    private resource: Resource;
    private maxWorkers: number = 4;

    constructor(resourceId: string) {
        this.resource = GameUtils.getResourceById(resourceId);
        if (!this.resource) {
            throw Error('Not Found!');
        }
    }

    public get priority(): number {
        const minPriority = 45;
        const maxPriority = 100;

        // Once we hit 1500 energy in the pile, highest priority.
        let valuePriority = 100* (1 - (this.resource.amount/1500));
        valuePriority = Math.min(maxPriority, valuePriority);
        valuePriority = Math.max(minPriority, valuePriority);

        let storagePriority = 100;
        if (this.resource.room) {
            storagePriority = 100*(RoomUtils.energyInRoom(this.resource.room) / RoomUtils.energyCapacityInRoom(this.resource.room));
            storagePriority = Math.min(maxPriority, storagePriority);
            storagePriority = Math.max(minPriority, storagePriority);
        }

        return Math.min(valuePriority, storagePriority);
    }

    public type: TaskType = 'gatherresource';

    public get targetId(): string {
        return this.resource.id;
    }

    public get Resource(): Resource {
        return this.resource;
    }

    public get targetPosition(): RoomPosition {
        return this.resource.pos;
    }

    public canBePerformedBy(creep: CreepModel): boolean {
        return creep.carry.energy < creep.carryCapacity;
    }

    public perform(creep: CreepModel): boolean {
        if (creep.pickup(this.resource) === ERR_NOT_IN_RANGE) {
            creep.moveTo(this.resource, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
        return true;
    }

    public spawnCreep(): BodyPartConstant[] | null {
        if ((this.totalWorkers() < this.maxWorkers)
            && this.priority <= 60) {
            return [ WORK, CARRY, MOVE];
        }
        return null;
    }

    private totalWorkers(): number {
        return GameUtils.Creeps.filter(c => c.taskTarget === this.type).length;
    }
}
profiler.registerClass(GatherTask, 'gatherTask');