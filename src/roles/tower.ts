export function run(tower : Tower)
{
	var closestHostile = <Creep>tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
	if(closestHostile) {
		tower.attack(closestHostile);
	}
}