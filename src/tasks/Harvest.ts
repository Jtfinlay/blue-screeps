import StructureUtils from '../utils/Structure';
import SourceUtils from '../utils/Source';
import CreepModel, { CreepTaskType } from '../models/Creep';

class HarvestRoleClass {

    public canHarvestEnergy(creep: CreepModel): boolean {
        return (creep.carry.energy < creep.carryCapacity);
    }

    public canDeliverEnergy(creep: CreepModel): boolean {
        return (creep.carry.energy > 0);
    }

    public findHarvestSource(creep: CreepModel): Source | null {
        return creep.room.find(FIND_SOURCES)[0];
    }

    public gatherEnergy(creep: CreepModel): boolean {
        const source = <Source | null>Game.getObjectById(<string>creep.taskTarget);
        if (!source) {
            return false;
        }
        if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
        return true;
    }

    public deliverEnergy(creep: CreepModel): boolean {
        const target = <AnyStructure | null>Game.getObjectById(<string>creep.taskTarget);
        if (!target) {
            return false;
        }

        if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
        return true;
    }

    public findHarvestTarget(creep: CreepModel): AnyStructure | null {
        const targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure: AnyStructure) => {
                return (StructureUtils.isHarvestTarget(structure)
                    && StructureUtils.getEnergy(structure) < StructureUtils.getEnergyCapacity(structure))
            }
        });
        if (targets.length > 0) {
            return targets[0];
        }
        return null;
    }
}

const HarvestRole = new HarvestRoleClass();
export default HarvestRole;