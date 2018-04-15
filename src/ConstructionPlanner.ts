

class ConstructionPlannerClass {

    public process(room: Room): void {
        if (Game.time % 100 === 0) {
            this.planRoads(room);
        }
    }

    private planRoads(room: Room): void {
        const spawnPos = room.find(FIND_MY_SPAWNS).map(spawn => spawn.pos);
        const sourcePos = room.find(FIND_SOURCES).map(source => source.pos);
        const mineralPos = room.find(FIND_MINERALS).map(mineral => mineral.pos);
        const controllerPos = room.controller && room.controller.pos;

        spawnPos.forEach(spawn => {
            sourcePos.forEach(source => this.planRoadsFromPosToPos(room, source, spawn));
            if (controllerPos) {
                this.planRoadsFromPosToPos(room, controllerPos, spawn);
            }
            mineralPos.forEach(mineral => this.planRoadsFromPosToPos(room, mineral, spawn));
        });
    }

    private planRoadsFromPosToPos(room: Room, source: RoomPosition, target: RoomPosition): void {
        const path = PathFinder.search(source, target);
        this.planRoadsAlongPath(room, path.path);
    }

    private planRoadsAlongPath(room: Room, path: RoomPosition[]): void {
        path.forEach(pos => {
            room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD);
        })
    }

}

const constructionPlanner = new ConstructionPlannerClass();
export default constructionPlanner;