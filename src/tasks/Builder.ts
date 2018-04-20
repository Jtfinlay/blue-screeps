import CreepModel from 'models/Creep';
import { BuildRoadTaskType, Task, TaskType } from './index';

export default class BuildTask implements Task {
    private constructionSite: ConstructionSite;

    public type: TaskType = 'build';

    constructor(constructionSiteId: string) {
        this.constructionSite = <ConstructionSite<BuildableStructureConstant>>Game.getObjectById(constructionSiteId);
        if (!this.constructionSite) {
            throw Error('Not Found!');
        }
    }

    public get targetId(): string {
        return this.constructionSite.id;
    }

    public chooseCreep(creeps: CreepModel[]): CreepModel | null {
        const sorted = creeps.sort(c => PathFinder.search(c.pos, this.constructionSite.pos).cost);
        for (let name in sorted) {
            let creep: CreepModel = sorted[name];
            if (this.canBePerformedBy(creep)) {
                return creep;
            }
        }
        return null;
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
}