import profiler from 'screeps-profiler';

import CreepModel from './models/Creep';
import SourceModel from './models/Source';

import BuilderTask from './tasks/Builder';
import DeliverTask from './tasks/Deliver';
import GatherTask from './tasks/Gather';
import HarvestTask from './tasks/Harvest';

import ConstructionPlanner from './ConstructionPlanner';
import TaskList from './Tasklist';

import GameUtils from './utils/GameUtils';
import PositionUtils from './utils/PositionUtils';
import RoomUtils from './utils/RoomUtils';
import Structure from './utils/Structure';

export default function enableProfiler() {
    profiler.enable();
    profiler.registerClass(CreepModel, 'creepModel');
    profiler.registerClass(SourceModel, 'sourceModel');

    profiler.registerClass(BuilderTask, 'builderTask');
    profiler.registerClass(DeliverTask, 'deliverTask');
    profiler.registerClass(GatherTask, 'gatherTask');
    profiler.registerClass(HarvestTask, 'harvestTask');

    profiler.registerObject(TaskList, 'taskList');
    profiler.registerObject(ConstructionPlanner, 'constructionPlanner');

    profiler.registerObject(GameUtils, 'gameUtils');
    profiler.registerObject(PositionUtils, 'positionUtils');
    profiler.registerObject(RoomUtils, 'roomUtils');
    profiler.registerObject(Structure, 'structureUtils');
}