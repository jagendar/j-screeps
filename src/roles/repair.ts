import * as RepairStructures from "../behaviours/repairStructures";
import * as GatherEnergy from "../behaviours/gatherEnergy";

export function run (creep : Creep) {
    if(creep.memory.building && creep.carry.energy == 0) {
        creep.memory.building = false;
        creep.memory.buildingTarget = null;
    }
    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
        creep.memory.building = true;
    }

    if(creep.memory.building) {
        RepairStructures.RepairStructures(creep);
    }
    else {
        GatherEnergy.gatherFromSource(creep);
    }

}