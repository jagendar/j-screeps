export function PerformConstruction (creep : Creep)
{
    var target = <ConstructionSite>creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
    if(target) {
        if(creep.build(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
}