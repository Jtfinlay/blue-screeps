import CreepModel from './Creep';
import GameUtils from '../utils/GameUtils';
import HarvestTask from '../tasks/Harvest';
import PositionUtils from '../utils/PositionUtils';
import { Task } from '../tasks';

export default class SourceModel extends Source {
    readonly prototype: Source;

    constructor(source: Source) {
        super(source.id);
        this.prototype = source;
    }

    public createTasks(): Task[] {
        return Array.from({length: this.openHarvestPositions()}, 
            () => new HarvestTask(this.id));
    }

    public get canBeHarvested(): boolean {
        return this.energy > 0 || this.ticksToRegeneration < 20;
    }

    public totalHarvestPositions(range: number): RoomPosition[] {
        return PositionUtils.findPositionsWithinRange(this.pos, range)
            .filter(pos => !PositionUtils.isUnpassable(pos));
    }

    public openHarvestPositions(creep?: CreepModel): number {
        if (!this.canBeHarvested) {
            return 0;
        }
        const totalPositions = this.totalHarvestPositions(1);
        const locPositions = totalPositions
            .filter(pos => !pos.lookFor('creep').length || 
                (creep !== undefined && creep.atPosition(pos))).length;
        const taskPositions = totalPositions.length - this.assignedCreeps
            .filter(c => (creep === undefined) || (c.id !== creep.id)).length;

        console.log(this.id +': total('+totalPositions.length+'), loc('+locPositions+'), task('+taskPositions+')');

        return Math.min(taskPositions, locPositions);
    }

    private get assignedCreeps(): CreepModel[] {
        return GameUtils.Creeps
            .filter(creep => creep.taskTarget === this.id);
    }
}
