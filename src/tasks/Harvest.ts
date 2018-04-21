import SourceModel from '../models/Source';
import CreepModel from '../models/Creep';
import GameUtils from '../utils/GameUtils';
import { Task, HarvestEnergyTaskType, TaskType } from './index';
import profiler from 'screeps-profiler';

export default class HarvestTask implements Task {
    private source: SourceModel;
    
    public type: TaskType = 'harvestenergy';

    constructor(sourceId: string) {
        this.source = GameUtils.getSourceById(sourceId);
    }

    public get priority(): number {
        return 50;
    }

    public get targetId(): string {
        return this.source.id;
    }

    public get Source(): SourceModel {
        return this.source;
    }

    public chooseCreep(creeps: CreepModel[]): CreepModel | null {
        if (creeps.length <= 0) {
            return null;
        }

        let efficiencies: number[] = Array.from(new Set(
            creeps.map(c => HarvestTask.calculateEfficiency(c))
        )).sort().reverse();

        for (var i=0; i<efficiencies.length; i++) {
            let eff = efficiencies[i];
            if (eff <= 0) {
                continue;
            }
            let effCreeps = creeps.filter(c => HarvestTask.calculateEfficiency(c) === eff);
            let ordered = effCreeps.sort(c => PathFinder.search(c.pos, this.source.pos).cost);
            return ordered[0];
        }
        return null;
    }

    public canBePerformedBy(creep: CreepModel): boolean {
        return HarvestTask.calculateEfficiency(creep) >= 0;
    }

    public static calculateEfficiency(creep: CreepModel) : number {
        return 2 * creep.body.filter(part => part.type === WORK).length;
    }

    public perform(creep: CreepModel): boolean {
        if (creep.carry.energy >= creep.carryCapacity) {
            creep.drop(RESOURCE_ENERGY);
        }

        if (creep.harvest(this.source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(this.source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
        return true;
    }
}
profiler.registerClass(HarvestTask, 'harvestTask');