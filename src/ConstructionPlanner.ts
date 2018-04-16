

class ConstructionPlannerClass {

    public process(room: Room): void {
        // if (Game.time % 100 === 0) {
            this.planContainers(room);
            this.planRoads(room);
        // }
    }

    private planContainers(room: Room): void {
        const maxContainers: number = 5;
        let plannedContainers: number = 0;

        const mineralPos = room.find(FIND_MINERALS).map(mineral => mineral.pos);
        const sourcePos = room.find(FIND_SOURCES).map(source => source.pos);
        const spawnPos = room.find(FIND_MY_SPAWNS).map(spawn => spawn.pos);
        const controllerPos = room.controller && room.controller.pos;

        spawnPos.forEach(spawn => {
            if (plannedContainers >= maxContainers) {
                return;
            }
            if (controllerPos) {
                this.planContainerBetweenPositions(room, 1/8, controllerPos, spawn);
                plannedContainers++;
            }
            sourcePos.forEach(source => {
                if (plannedContainers >= maxContainers) {
                    return;
                }
                this.planContainerBetweenPositions(room, 1/8, source, spawn);
                plannedContainers++;
            });
            mineralPos.forEach(min => {
                if (plannedContainers >= maxContainers) {
                    return;
                }
                this.planContainerBetweenPositions(room, 1/8, min, spawn);
                plannedContainers++;
            });

            // If another left, drop near the spawn.
            if (controllerPos) {
                console.log('planned: '+ plannedContainers);
                if (plannedContainers >= maxContainers) {
                    return;
                }
                this.planContainerBetweenPositions(room, 1/2, controllerPos, spawn);
                plannedContainers++;
            }
        });
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
        const path = PathFinder.search(source, target).path;
        path.forEach(pos => {
            room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD);
        })
    }

    private planContainerBetweenPositions(room: Room, fraction: number, source: RoomPosition, target: RoomPosition) {
        let path = PathFinder.search(source, target).path;
        let iPos = Math.ceil(path.length * fraction);
        let pos = path[iPos];
    }

}

const constructionPlanner = new ConstructionPlannerClass();
export default constructionPlanner;