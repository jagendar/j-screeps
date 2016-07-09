import * as Builder from "./roles/builder";
import * as Harvester from "./roles/harvester";
import * as Upgrader from "./roles/upgrader";
import * as Repair from "./roles/repair";
import * as BattleBro from "./roles/battlebro";
import * as Tower from "./roles/tower";
import * as StructurePlanner from "./planners/structurePlanner"
import * as SpawnPlanner from "./planners/spawnPlanner"

/**
 * Singleton object.
 * Since singleton classes are considered anti-pattern in Typescript, we can effectively use namespaces.
 * Namespace's are like internal modules in your Typescript application. Since GameManager doesn't need multiple instances
 * we can use it as singleton.
 */
export namespace GameManager {
    // this is called once on the initial load of the code; however, the code in
    // screeps seems to reload quite frequently.  It could be useful to do some
    // sort of pre-caching here
    export function globalBootstrap() {
    }

    export function loop() 
	{
		for(var roomKey in Game.rooms)
		{
			StructurePlanner.buildDefense(Game.rooms[roomKey]);
		}
		
		for(var buildingKey in Game.structures)
		{
			var building = Game.structures[buildingKey];
			if(building.structureType == STRUCTURE_TOWER)
			{
				Tower.run(<StructureTower>building);
			}
		}

		//TODO: update this to repopulate creeps?
		for(var i in Memory.creeps) {
			if(!Game.creeps[i]) {
				delete Memory.creeps[i];
			}
		}

		for(var name in Game.creeps) {
			var creep = Game.creeps[name];
			if(creep.memory.role == 'harvester') {
				Harvester.run(creep);
			}
			if(creep.memory.role == 'upgrader') {
				Upgrader.run(creep);
			}
			if(creep.memory.role == 'builder') {
				Builder.run(creep);
			}
			if(creep.memory.role == 'repair') {
				Repair.run(creep);
			}
			if(creep.memory.role == 'battlebro') {
				BattleBro.run(creep);
			}
		}
		SpawnPlanner.run();
	}
}
