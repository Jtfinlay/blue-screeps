class StructureUtils {

    public isHarvestTarget(structure: AnyStructure): boolean {
        return (structure instanceof StructureSpawn)
            || (structure instanceof StructureTower)
            || (structure instanceof StructureExtension);
    }

    public getEnergy(structure: AnyStructure): number {
        if (structure instanceof StructureSpawn) {
            return (structure as StructureSpawn).energy;
        }

        if (structure instanceof StructureExtension) {
            return (structure as StructureExtension).energy;
        }

        if (structure instanceof StructureTower) {
            return (structure as StructureTower).energy;
        }

        return 0;
    }

    public getEnergyCapacity(structure: AnyStructure): number {
        if (structure instanceof StructureSpawn) {
            return (structure as StructureSpawn).energyCapacity;
        }

        if (structure instanceof StructureExtension) {
            return (structure as StructureExtension).energyCapacity;
        }

        if (structure instanceof StructureTower) {
            return (structure as StructureTower).energyCapacity;
        }

        return 0;
    }
}

const utils = new StructureUtils();
export default utils;