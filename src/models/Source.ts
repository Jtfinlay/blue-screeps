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
        if (this.peekEfficiency() <= this.currentHarvestEfficiency()) {
            return [];
        }

        return Array.from({length: this.openHarvestPositions()}, 
            () => new HarvestTask(this.id));
    }

    public totalHarvestPositions(range: number): RoomPosition[] {
        return PositionUtils.findPositionsWithinRange(this.pos, range)
            .filter(pos => !PositionUtils.isUnpassable(pos));
    }

    public currentHarvestEfficiency(): number {
        return this.assignedCreeps.map(c => HarvestTask.calculateEfficiency(c))
            .reduce((a, b) => a + b);
    }

    public peekEfficiency() {
        // The energy capacity changes by room, but it regenerates every 300 game ticks.
        // Therefore ( capacity / 300 ) is the peek efficiency for harvesting per tick.
        return Math.ceil(this.energyCapacity / 300);
    }

    public openHarvestPositions(creep?: CreepModel): number {
        const totalPositions = this.totalHarvestPositions(1);
        const locPositions = totalPositions
            .filter(pos => !pos.lookFor('creep').length || 
                (creep !== undefined && creep.atPosition(pos))).length;
        const taskPositions = totalPositions.length - this.assignedCreeps
            .filter(c => (creep === undefined) || (c.id !== creep.id)).length;

        return Math.min(taskPositions, locPositions);
    }

    private get assignedCreeps(): CreepModel[] {
        return GameUtils.Creeps
            .filter(creep => creep.taskTarget === this.id);
    }
}
