export function RepairStructures (creep : Creep)
{
    var newTarget = creep.memory.buildingTarget == undefined || creep.memory.buildingTarget == null;
    if(!newTarget) //check if it's full
    {
        var target = <Structure>Game.getObjectById(creep.memory.buildingTarget);
        if(target == null)
            newTarget = true;
        else if(target.hits == target.hitsMax)
            newTarget = true;
    }
    if(newTarget)
    {
        var targets = <Structure[]>creep.room.find(FIND_STRUCTURES, 
            { filter: (s : Structure) => 
                { 
                    if(s.structureType == STRUCTURE_ROAD) return s.hits < s.hitsMax * .5; 
                    return s.hits < s.hitsMax; 
                } 
            });
        targets = targets.sort((a,b) => { return a.hits - b.hits;});
        //TODO: sort by closeness
        if(targets.length)
            creep.memory.buildingTarget = targets[0].id;
        }
        if(creep.memory.buildingTarget) {

        var target = <Structure>Game.getObjectById(creep.memory.buildingTarget);
        //creep.say(target.pos.x + ", " + target.pos.y);
        if(creep.repair(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
}