import CreepModel from '../models/Creep';

export interface Task {
    type: TaskType;
    targetId: string;
    priority: number;
    targetPosition: RoomPosition;

    canBePerformedBy(creep: CreepModel): boolean;
    spawnCreep(): BodyPartConstant[] | null;
    perform(creep: CreepModel): boolean;
}

export type TaskType = 
    | HarvestEnergyTaskType
    | DeliverEnergyTaskType
    | BuildRoadTaskType
    | GatherResourceTaskType;

export type HarvestEnergyTaskType = 'harvestenergy';
export type DeliverEnergyTaskType = 'deliverenergy';
export type BuildRoadTaskType = 'build';
export type GatherResourceTaskType = 'gatherresource';