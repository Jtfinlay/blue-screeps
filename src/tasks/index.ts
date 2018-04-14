import CreepModel from '../models/Creep';

export interface Task {
    type: TaskType;
    targetId: string;
    canBePerformedBy(creep: CreepModel): boolean;
    perform(creep: CreepModel): boolean;
}

export type TaskType = 
    | HarvestEnergyTaskType
    | DeliverEnergyTaskType;

export type HarvestEnergyTaskType = 'harvestenergy';
export type DeliverEnergyTaskType = 'deliverenergy';