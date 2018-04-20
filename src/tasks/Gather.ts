import CreepModel from 'models/Creep';
import { Task, GatherResourceTaskType, TaskType } from './index';
import GameUtils from 'utils/GameUtils';
import StructureUtils, { StructureType } from 'utils/Structure';

export default class GatherTask implements Task {
    private resource: Resource;

    constructor(resourceId: string) {
        this.resource = GameUtils.getResourceById(resourceId);
        if (!this.resource) {
            throw Error('Not Found!');
        }
    }

    public type: TaskType = 'gatherresource';

    public get targetId(): string {
        return this.resource.id;
    }

    public get Resource(): Resource {
        return this.resource;
    }

    public canBePerformedBy(creep: CreepModel): boolean {
        return creep.carry.energy < creep.carryCapacity;
    }

    public chooseCreep(creeps: CreepModel[]): CreepModel | null {
        const sorted = creeps.sort(c => PathFinder.search(c.pos, this.resource.pos).cost);
        for (let name in sorted) {
            let creep: CreepModel = sorted[name];
            if (this.canBePerformedBy(creep)) {
                return creep;
            }
        }
        return null;
    }

    public perform(creep: CreepModel): boolean {
        if (creep.pickup(this.resource) === ERR_NOT_IN_RANGE) {
            creep.moveTo(this.resource, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
        return true;
    }
}