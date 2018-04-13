
class LookAtUtilsClass {
    public blocksMovement(lookAt: LookAtResult): boolean {
        return (lookAt.terrain === "wall");
    }
}

const utils = new LookAtUtilsClass();
export default utils;