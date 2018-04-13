
import LookAtUtils from './utils-lookat';

class SourceUtilsClass {
    public slotCount(source: Source, range: number): number {

        const pos: RoomPosition = source.pos;
        let xi = (pos.x - range);
        let xf = (pos.x + range);
        let yi = (pos.y - range);
        let yf = (pos.y + range);
        if (xi < 0) { xi = 0; }
        if (xf > 49) { xf = 49; }
        if (yi < 0) { yi = 0; }
        if (yf > 49) { yf = 49; }

        let result = 0;
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
                result++;
            }
        }

        return result;
    }
}

const utils = new SourceUtilsClass();
export default utils;