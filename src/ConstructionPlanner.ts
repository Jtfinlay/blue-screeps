import profiler from 'screeps-profiler';
import PositionUtils from './utils/PositionUtils';

class ConstructionPlannerClass {

    public process(room: Room): void {
        if (Game.time % 100 === 0) {
            this.planExtensions(room);
            this.planContainers(room);
            this.planRoads(room);
        }
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
                if (plannedContainers >= maxContainers) {
                    return;
                }
                this.planContainerBetweenPositions(room, 1/2, controllerPos, spawn);
                plannedContainers++;
            }
        });
    }

    private planExtensions(room: Room): void {
        const controller = room.controller;
        if (controller === undefined) {
            return;
        }

        // From docs: http://docs.screeps.com/api/#StructureExtension
        const maxExtensionMap = [0, 0, 5, 10, 20, 30, 40, 50, 60];

        let maxExtensions: number;
        if (maxExtensionMap.length - 1 < controller.level) {
            maxExtensions = maxExtensionMap[maxExtensionMap.length - 1];
        } else {
            maxExtensions = maxExtensionMap[controller.level];
        }

        const mineralPos = room.find(FIND_MINERALS).map(mineral => mineral.pos);
        const sourcePos = room.find(FIND_SOURCES).map(source => source.pos);
        const spawnPos = room.find(FIND_MY_SPAWNS).map(spawn => spawn.pos);

        let plannedExtensions = 0;
        sourcePos.forEach(s => {
            if (plannedExtensions >= maxExtensions) {
                return;
            }
            const positions = [room.getPositionAt(s.x-2, s.y), room.getPositionAt(s.x, s.y-2), 
                room.getPositionAt(s.x+2, s.y), room.getPositionAt(s.x, s.y+2)];
            positions.forEach(p => {
                if (plannedExtensions >= maxExtensions) {
                    return;
                }
                if (p === null) {
                    return;
                }
                if (!PositionUtils.isUnpassable(p) && !PathFinder.search(s, p).incomplete) {
                    room.createConstructionSite(p.x, p.y, STRUCTURE_EXTENSION);
                    plannedExtensions++;
                }
            })
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
        room.createConstructionSite(pos.x, pos.y, STRUCTURE_CONTAINER);
    }

}
profiler.registerClass(ConstructionPlannerClass, 'constructionPlanner');

const constructionPlanner = new ConstructionPlannerClass();
export default constructionPlanner;