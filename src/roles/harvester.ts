

export function run(creep : Creep) {
    if(creep.memory.loading == undefined) creep.memory.loading = true;
    if(creep.carry.energy == 0)
        creep.memory.loading = true;
    if(creep.carry.energy == creep.carryCapacity)
        creep.memory.loading = false;

    if(creep.memory.loading) {
        var source = <Source>creep.pos.findClosestByPath(FIND_SOURCES, {
            filter: (source : Source) => {
                return source.energy >= creep.carryCapacity;
            }
        });
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    }
    else {
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
    if(creep.memory.role == 'harvester')
    {
        creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
    }
}