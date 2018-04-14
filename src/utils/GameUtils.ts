import CreepModel from '../models/Creep';
import SourceModel from '../models/Source';

class GameUtilsClass {
    private creeps: CreepModel[] | null = null;
    
    public get Creeps(): CreepModel[] {
        this.creeps = [];
        for (const name in Game.creeps){
            this.creeps.push(new CreepModel(Game.creeps[name]));
        }
        return this.creeps;
    }

    public getSourceById(target: string): SourceModel {
        return new SourceModel(<Source>Game.getObjectById(target));
    }

    public getStructureById(target: string): AnyStructure {
        return <AnyStructure>Game.getObjectById(target);
    }
}

const gameUtils = new GameUtilsClass();
export default gameUtils;