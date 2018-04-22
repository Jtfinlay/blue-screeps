import CreepModel from 'models/Creep';
import { BuildRoadTaskType, Task, TaskType } from './index';
import profiler from 'screeps-profiler';
import GameUtils from 'utils/GameUtils';

export default class BuildTask implements Task {
    private constructionSite: ConstructionSite;
    private maxWorkers: number = 4;

    public type: TaskType = 'build';

    constructor(constructionSiteId: string) {
        this.constructionSite = <ConstructionSite<BuildableStructureConstant>>Game.getObjectById(constructionSiteId);
        if (!this.constructionSite) {
            throw Error('Not Found!');
        }
    }

    public get priority(): number {
        switch (this.constructionSite.structureType) {
            case STRUCTURE_EXTENSION:
                return 50;
            case STRUCTURE_CONTAINER:
                return 60;
            case STRUCTURE_ROAD:
                return 65;
            case STRUCTURE_WALL:
                return 70;
            default:
                console.log('unknown priority to assigned for buildTask of ' + this.constructionSite.structureType);
                return 60;
        }
    }

    public get targetId(): string {
        return this.constructionSite.id;
    }

    public get targetPosition(): RoomPosition {
        return this.constructionSite.pos;
    }

    public canBePerformedBy(creep: CreepModel): boolean {
        return creep.carry.energy > 0;
    }

    public perform(creep: CreepModel): boolean {
        if (creep.build(this.constructionSite) == ERR_NOT_IN_RANGE) {
            creep.moveTo(this.constructionSite, {visualizePathStyle: {stroke: '#BFFF00'}});
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
}
profiler.registerClass(BuildTask, 'buildTask');