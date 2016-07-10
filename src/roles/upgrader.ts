import * as UpgradeBehaviour from "../behaviours/upgrade";
import * as GatherEnergy from "../behaviours/gatherEnergy";

export function run (creep : Creep)
{
    if(creep.memory.upgrading && creep.carry.energy == 0) {
        creep.memory.upgrading = false;
    }
    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
        creep.memory.upgrading = true;
    }

    if(creep.memory.upgrading) {
        UpgradeBehaviour.DoUpgrade(creep);
    }
    else {
        GatherEnergy.gatherFromSource(creep);
    }
}