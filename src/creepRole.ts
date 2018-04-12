import StructureUtils from './utils-structure';

class CreepRoles {
    public run(creep: Creep): void {
        this.harvest(creep);
    }

    private harvest(creep: Creep): void {
        if (creep.carry.energy < creep.carryCapacity) {
            const source = this.findHarvestSource(creep);
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}})
            }
        } else {
            const target = this.findHarvestTarget(creep);
            if (target && creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }

    private findHarvestSource(creep: Creep): Source {
        return creep.room.find(FIND_SOURCES)[0];
    }

    private findHarvestTarget(creep: Creep): AnyStructure | null {
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

const creepRoles = new CreepRoles();
export default creepRoles;