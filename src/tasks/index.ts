import CreepModel from '../models/Creep';

export interface Task {
    type: TaskType;
    targetId: string;
    canBePerformedBy(creep: CreepModel): boolean;
    chooseCreep(creeps: CreepModel[]): CreepModel | null;
    perform(creep: CreepModel): boolean;
}

export type TaskType = 
    | HarvestEnergyTaskType
    | DeliverEnergyTaskType
    | BuildRoadTaskType;

export type HarvestEnergyTaskType = 'harvestenergy';
export type DeliverEnergyTaskType = 'deliverenergy';
export type BuildRoadTaskType = 'build';