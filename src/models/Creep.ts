import HarvestTask from '../tasks/Harvest';
import { Task, TaskType } from '../tasks';
import DeliverTask from 'tasks/Deliver';
import RoadBuildTask from 'tasks/Builder';
import GatherTask from 'tasks/Gather';

export interface CreepStore extends CreepMemory {
    taskType: TaskType | undefined;
    taskTarget: string | undefined;
}

export default class CreepModel extends Creep {
    readonly prototype: Creep;

    constructor(creep: Creep) {
        super(creep.id);
        this.prototype = creep;
    }

    public validateTask(): void {
        if (this.task && !this.canCompleteTask()) {
            this.wipe();
        }
        if (!this.task || !this.taskTarget) {
            this.wipe();
        }
    }

    public run(): void {
        if (!this.task) {
            this.say('bored');
            return;
        }

        if (!this.performAction()) {
            console.log(this.prototype.name + ' couldn\'t perform their action.');
            this.say('whoops');
            this.wipe();
        }
    }

    public get task(): Task | undefined {
        try {
            switch (this.Store.taskType) {
                case 'harvestenergy':
                    return new HarvestTask(<string>this.taskTarget);
                case 'deliverenergy':
                    return new DeliverTask(<string>this.taskTarget);
                case 'build':
                    return new RoadBuildTask(<string>this.taskTarget);
                case 'gatherresource':
                    return new GatherTask(<string>this.taskTarget);
                default:
                    if (this.Store.taskType !== undefined) {
                        console.log(this.name + ' doesn\'t know how to ' + this.Store.taskType);
                    }
                    return undefined;
            }
        } catch {
            return undefined;
        }
    }

    public set task(value: Task | undefined) {
        if (value === undefined) {
            this.Store.taskType = undefined;
            this.Store.taskTarget = undefined;
        } else {
            this.Store.taskType = value.type;
            this.Store.taskTarget = value.targetId;
            this.say(value.type);
        }
    }

    public get taskTarget(): string | undefined {
        return this.Store.taskTarget;
    }

    public set taskTarget(value: string | undefined) {
        this.Store.taskTarget = value;
    }

    public get speed(): number {
        const weight = this.body.map(part => part.type !== 'move' && part.type !== 'carry').length
            + Math.ceil(this.carry.energy / 49);
        const speed = this.body.map(part => part.type === 'move').length;
        return weight / speed;
    }

    public atPosition(pos: RoomPosition): boolean {
        return (pos.x === this.pos.x) && (pos.y === this.pos.y);
    }

    public get Store(): CreepStore {
        return (Memory.creeps[this.prototype.name] as CreepStore);
    }

    private wipe(): void {
        this.task = undefined;
        this.taskTarget = undefined;
    }

    private canCompleteTask(): boolean {
        if (!this.task) {
            return false;
        }
        return this.task.canBePerformedBy(this);
    }

    private performAction(): boolean {
        if (!this.task) {
            return false;
        }
        return this.task.perform(this);
    }
}