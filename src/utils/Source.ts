import LookAtUtils from './LookAt';
import CreepModel from '../models/Creep';

class SourceUtilsClass {

    public hasRoomForCreep(source: Source, creep: CreepModel): boolean {
        // check physical space. Ignore whether this creep is on the spot
        let openSlots = this.availableSlots(source, 1)
            .filter(pos => !pos.lookFor("creep").length || ((pos.x === creep.pos.x) && (pos.y === creep.pos.y)));
        if (openSlots.length <= 0) {
            return false;
        }

        let targeterEfficiency = 0;
        for (var name in Game.creeps) {
            const tmpCreep = new CreepModel(Game.creeps[name]);
            if ((tmpCreep.taskTarget !== source.id) || (tmpCreep.id === creep.id)) {
                continue;
            }
            targeterEfficiency += tmpCreep.energyHarvestEfficiency;
        }
        // todo something with the efficiency

        return true;
    }

    public availableSlots(source: Source, range: number): RoomPosition[] {
        const result: RoomPosition[] = [];

        const pos: RoomPosition = source.pos;
        let xi = (pos.x - range);
        let xf = (pos.x + range);
        let yi = (pos.y - range);
        let yf = (pos.y + range);
        if (xi < 0) { xi = 0; }
        if (xf > 49) { xf = 49; }
        if (yi < 0) { yi = 0; }
        if (yf > 49) { yf = 49; }

        for (let x=xi; x<=xf; x++) {
            for (let y=yi; y<=yf; y++) {
                if ((pos.x === x) && (pos.y === y)) {
                    continue;
                }
                let blockers: LookAtResult<LookConstant>[] = source.room.lookAt(x,y);
                blockers = blockers.filter(target => LookAtUtils.blocksMovement(target));

                if (blockers.length > 0) {
                    continue;
                }
                const position = source.room.getPositionAt(x,y);
                if (position !== null) {
                    result.push(position);
                }
            }
        }
        return result;
    }
}

const utils = new SourceUtilsClass();
export default utils;