
class PositionUtilsClass {
    public blocksMovement(lookAt: LookAtResult): boolean {
        return (lookAt.terrain === "wall");
    }

    public isUnpassable(pos: RoomPosition): boolean {
        const items = Game.rooms[pos.roomName].lookAt(pos.x, pos.y);
        if (items.length <= 0) {
            return false;
        }
        return items.filter(item => this.blocksMovement(item)).length > 0;
    }

    public findPositionsWithinRange(pos: RoomPosition, range: number): RoomPosition[]
    {
        const result: RoomPosition[] = [];

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
                const roomPos = Game.rooms[pos.roomName].getPositionAt(x,y);
                if (roomPos !== null) {
                    result.push(roomPos);
                }
            }
        }
        return result;
     }
}

const utils = new PositionUtilsClass();
export default utils;