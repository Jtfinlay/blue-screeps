import CreepModel from 'models/Creep';
import { BuildRoadTaskType, Task, TaskType } from './index';

export default class RoadBuildTask implements Task {
    private constructionSite: ConstructionSite;

    public type: TaskType = 'buildroad';

    constructor(constructionSiteId: string) {
        this.constructionSite = <ConstructionSite<BuildableStructureConstant>>Game.getObjectById(constructionSiteId);
    }

    public get targetId(): string {
        return this.constructionSite.id;
    }

    public canBePerformedBy(creep: CreepModel): boolean {
        return creep.carry.energy > 0;
    }

    public perform(creep: CreepModel): boolean {
        if(creep.build(this.constructionSite) == ERR_NOT_IN_RANGE) {
            creep.moveTo(this.constructionSite, {visualizePathStyle: {stroke: '#BFFF00'}});
        }
        return true;
    }
}