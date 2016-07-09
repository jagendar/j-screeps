export function run(tower : Tower)
{
	var closestHostile = <Creep>tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
	if(closestHostile) {
		tower.attack(closestHostile);
	}
	/*
	if(tower.energy > tower.energyCapacity * .75)
	{
		//todo: more variable filtering - sort by 
		var closestDamagedStructure = <Structure>tower.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: (structure : Structure) => structure.hits < structure.hitsMax * .5
		});
		if(closestDamagedStructure) {
			tower.repair(closestDamagedStructure);
		}
	}*/
}