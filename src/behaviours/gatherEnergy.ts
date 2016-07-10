export function gatherFromSource(creep : Creep)
{
    var source = <Source>creep.pos.findClosestByPath(FIND_SOURCES, {
        filter: (source : Source) => {
            return source.energy >= creep.carryCapacity;
        }
    });
    if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
    }
}