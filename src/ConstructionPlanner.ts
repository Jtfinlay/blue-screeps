

class ConstructionPlannerClass {

    public process(room: Room): void {
        // if (Game.time % 50 === 0) {
            this.planRoads(room);
        // }
    }

    private planRoads(room: Room): void {
        const spawnPos = room.find(FIND_MY_SPAWNS).map(spawn => spawn.pos);
        const sourcePos = room.find(FIND_SOURCES).map(source => source.pos);

        spawnPos.forEach(spawn => sourcePos.forEach(source => {
            const path = PathFinder.search(spawn, source);
            this.planRoadsAlongPath(room, path.path);
        }));
    }

    private planRoadsAlongPath(room: Room, path: RoomPosition[]): void {
        path.forEach(pos => {
            room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD);
        })
    }

}

const constructionPlanner = new ConstructionPlannerClass();
export default constructionPlanner;