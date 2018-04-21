import StructureUtils from '../utils/Structure';
import SourceModel from '../models/Source';
import profiler from 'screeps-profiler';

class RoomUtilsClass {
    public findSourcesInRoom(room: Room): SourceModel[] {
        return room.find(FIND_SOURCES).map(source => new SourceModel(source));
    }
    public findDroppedResourcesInRoom(room: Room): Resource[] {
        return room.find(FIND_DROPPED_RESOURCES);
    }
    public firstRoom(): Room {
        for (var name in Game.rooms) {
            return Game.rooms[name];
        }
        throw new Error('No room found!');
    }

    public energyInRoom(room: Room): number {
        const structureEnergy = room.find(FIND_STRUCTURES, {
            filter: (structure: AnyStructure) => StructureUtils.isHarvestTarget(structure)
        }).map(s => StructureUtils.getEnergy(s));
        return structureEnergy.reduce((a,b) => a+b);
    }

    public energyCapacityInRoom(room: Room): number {
        const structureEnergyCapacity = room.find(FIND_STRUCTURES, {
            filter: (structure: AnyStructure) => StructureUtils.isHarvestTarget(structure)
        }).map(s => StructureUtils.getEnergyCapacity(s));
        return structureEnergyCapacity.reduce((a,b) => a+b);
    }
}
profiler.registerClass(RoomUtilsClass, 'roomUtils');
const roomUtils = new RoomUtilsClass();
export default roomUtils;