import HarvestRole from '../tasks/Harvest';

export type CreepTaskType = 
    | GatherEnergyTaskType
    | DeliverEnergyTaskType 
    | null;

export type DeliverEnergyTaskType = 'deliverenergy';
export type GatherEnergyTaskType = 'gatherenergy';

export interface CreepStore extends CreepMemory {
    task: CreepTaskType;
    taskTarget: string | null;
}

export default class CreepModel extends Creep {
    readonly prototype: Creep;

    constructor(creep: Creep) {
        super(creep.id);
        this.prototype = creep;
    }

    public run(): void {
        if (this.task && !this.canPerformAction(this.task)) {
            this.wipe();
        }

        if (!this.task) {
            this.determineAction();
        }

        if (!this.performAction()) {
            console.log(this.prototype.name + ' couldn\'t perform their action.');
            this.say('whoops');
            this.wipe();
        }
    }

    public get task(): CreepTaskType {
        return this.Store.task;
    }

    public set task(value: CreepTaskType) {
        this.Store.task = value;
        if (value) {
            this.say(value);
        }
    }

    public get taskTarget(): string | null {
        return this.Store.taskTarget;
    }

    public set taskTarget(value: string | null) {
        this.Store.taskTarget = value;
    }

    private get Store(): CreepStore {
        return (Memory.creeps[this.prototype.name] as CreepStore);
    }

    private wipe(): void {
        this.task = null;
        this.taskTarget = null;
    }

    private canPerformAction(task: CreepTaskType): boolean {
        switch (task) {
            case 'gatherenergy':
                return HarvestRole.canHarvestEnergy(this);
            case 'deliverenergy':
                return HarvestRole.canDeliverEnergy(this);
            default:
                console.log('Unknown action');
                return false;
        }
    }

    private performAction(): boolean {
        switch (this.task) {
            case 'gatherenergy':
                return HarvestRole.gatherEnergy(this);
            case 'deliverenergy':
                return HarvestRole.deliverEnergy(this);
            default:
                console.log('Unknown action');
                return false;
        }
    }

    private determineAction(): boolean {
        // Can we harvest energy?
        if (HarvestRole.canHarvestEnergy(this)) {
            const source = HarvestRole.findHarvestSource(this);
            if (source) {
                this.task = 'gatherenergy';
                this.taskTarget = source.id;
                return true;
            }
        }

        // Can we provide energy?
        const target = HarvestRole.findHarvestTarget(this);
        if (target) {
            this.task = 'deliverenergy',
            this.taskTarget = target.id;
            return true;
        }

        return false;
    }
}