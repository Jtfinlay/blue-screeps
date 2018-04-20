import SourceModel from '../models/Source';

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
}

const roomUtils = new RoomUtilsClass();
export default roomUtils;