import CreepModel from 'models/Creep';
import { Task, DeliverEnergyTaskType, TaskType } from './index';
import GameUtils from 'utils/GameUtils';
import StructureUtils, { StructureType } from 'utils/Structure';

export default class DeliverTask implements Task {
    private structure: StructureType;
    
    public type: TaskType = 'deliverenergy';

    constructor(structureId: string) {
        this.structure = GameUtils.getStructureById(structureId);
    }

    public get targetId(): string {
        return this.structure.id;
    }

    public get Structure(): StructureType {
        return this.structure;
    }

    public canBePerformedBy(creep: CreepModel): boolean {
        if (this.structure instanceof StructureController) {
            return creep.carry.energy > 0;
        }

        return (creep.carry.energy > 0) 
            && (StructureUtils.getEnergy(this.structure) < StructureUtils.getEnergyCapacity(this.structure));
    }

    public perform(creep: CreepModel): boolean {
        if (creep.transfer(this.structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(this.structure, {visualizePathStyle: {stroke: '#ffffff'}});
        }
        return true;
    }

}