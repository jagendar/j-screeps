import * as GatherEnergy from "../behaviours/gatherEnergy";
import * as BuildStructures from "../behaviours/buildStructures";
import * as RepairStructures from "../behaviours/repairStructures";

export function run(creep : Creep)
{
    if(creep.memory.building && creep.carry.energy == 0) {
        creep.memory.building = false;
    }
    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
        creep.memory.building = true;
    }

    if(creep.memory.building) 
    {
        BuildStructures.PerformConstruction(creep);
    }
    else {
        GatherEnergy.gatherFromSource(creep);
    }
};