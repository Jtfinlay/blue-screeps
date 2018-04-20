import CreepModel from '../models/Creep';
import SourceModel from '../models/Source';
import { StructureType } from './Structure';

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

    public getStructureById(target: string): StructureType {
        return <StructureType> Game.getObjectById(target);
    }

    public getResourceById(target: string): Resource {
        return <Resource> Game.getObjectById(target);
    }
}

const gameUtils = new GameUtilsClass();
export default gameUtils;