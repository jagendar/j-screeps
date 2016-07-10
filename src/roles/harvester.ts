import * as GatherEnergy from "../behaviours/gatherEnergy";
import * as FillSpawns from "../behaviours/fillSpawns";

function UpdateState(creep : Creep)
{
    if(creep.memory.state == undefined)
        creep.memory.loading = true;
    if(creep.carry.energy == 0)
        creep.memory.loading = true;
    if(creep.carry.energy == creep.carryCapacity)
        creep.memory.loading = false;
}

export function run(creep : Creep) {
    UpdateState(creep);

    if(creep.memory.loading) {
        GatherEnergy.gatherFromSource(creep);
    }
    else {
        FillSpawns.fillWithCargo(creep);
    }
}