import SourceModel from '../models/Source';
import CreepModel from '../models/Creep';
import GameUtils from '../utils/GameUtils';
import { Task, HarvestEnergyTaskType, TaskType } from './index';

export default class HarvestTask implements Task {
    private source: SourceModel;
    
    public type: TaskType = 'harvestenergy';

    constructor(sourceId: string) {
        this.source = GameUtils.getSourceById(sourceId);
    }

    public get targetId(): string {
        return this.source.id;
    }

    public get Source(): SourceModel {
        return this.source;
    }

    public canBePerformedBy(creep: CreepModel): boolean {
        if (creep.carry.energy >= creep.carryCapacity) {
            return false;
        }

        return this.source.openHarvestPositions(creep) > 0;
    }

    public calculateEfficiency(creep: CreepModel) : number {
        const workEfficiency = 2 * creep.body.filter(part => part.type === WORK).length;
        
    }

    public perform(creep: CreepModel): boolean {
        if (creep.harvest(this.source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(this.source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
        return true;
    }
}