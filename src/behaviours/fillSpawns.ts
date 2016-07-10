export function fillWithCargo(creep : Creep)
{
    var structTarget = <Structure>creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure : any) => {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) &&
                    structure.energy < structure.energyCapacity;
            }
    });
    var creepTarget : Creep;
    if(!structTarget)
    {
        creepTarget = <Creep>creep.pos.findClosestByPath(FIND_CREEPS, {
            filter: (creep : Creep) => {
                return creep != undefined && creep.memory != undefined && (creep.memory.role == 'upgrader' || creep.memory.role == 'builder' || creep.memory.role == 'repair');
            }
        })
    }
    var target : any;
    if(structTarget) { target = structTarget; }
    else if(creepTarget) { target = creepTarget; }
    if(target)
    {
        if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
}