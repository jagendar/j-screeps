export function run(creep : Creep)
{
    //var targetRoom = <string>creep.memory.targetRoom;
    var targetRoom = "E42S19";
    if(!targetRoom)
    {
        //just look around this room I guess, since you're listless as fuck.
        fightLocally(creep);
        return;
    }
    var targetRoomAsRoom = Game.rooms[targetRoom]; 
    if(creep.room != targetRoomAsRoom)
    {
        pathToRoom(creep, targetRoom);
    }
    else
    {
        //find bros to fight!
        fightLocally(creep);
    }
};

function pathToRoom(creep : Creep, targetRoom : string)
{
    //TODO: is there a better way to do this?
    var roomPos = new RoomPosition(40, 25, targetRoom);
    
    creep.moveTo(roomPos);
}

function fightLocally(creep : Creep)
{
    checkMoveIntoRoom(creep);
    //TODO: if i have no combat parts, retreat & suicide or repair
    if(creep.memory.fightTarget)
    {
        tryFight(creep, <Structure>Game.getObjectById(<string>creep.memory.fightTarget));
    }
    
    var buildings = creep.room.find(FIND_HOSTILE_STRUCTURES, {
            filter : (s : Structure) => s.structureType != STRUCTURE_ROAD && s.structureType != STRUCTURE_CONTROLLER
        });
    var creeps = creep.room.find(FIND_HOSTILE_CREEPS);
    var spawns = creep.room.find(FIND_HOSTILE_SPAWNS);
    tryFight(creep, creep.pos.findClosestByRange(<[{}]>spawns.concat(creeps, buildings)));
        
}
/*
//TODO: should these use closest by path? range is likely much faster, but might yield less accurate results
function tryFightTower(creep : Creep)
{
    var bad = <Structure>creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
            filter : (s : Structure) => s.structureType == STRUCTURE_TOWER
        });
    return tryFight(creep, bad);
}

function tryFightCreep(creep : Creep)
{
    var bad = <Creep>creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    return tryFight(creep, bad);
}

function tryFightSpawns(creep : Creep)
{
    var bad = <Spawn>creep.pos.findClosestByRange(FIND_HOSTILE_SPAWNS);
    return tryFight(creep, bad);
}

function tryFightBuildings(creep : Creep)
{
    var bad = <Structure>creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
            filter : (s : Structure) => s.structureType != STRUCTURE_ROAD && s.structureType != STRUCTURE_CONTROLLER
        });
    return tryFight(creep, bad);
}

function tryFightInRange(creep : Creep)
{
    let targets = <any[]>[];
    targets = targets.concat(<any[]>creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1));
    targets = targets.concat(<any[]>creep.pos.findInRange(FIND_HOSTILE_SPAWNS, 1));
    targets = targets.concat(<any[]>creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1));
    if(targets.length > 0)
        return tryFight(creep, targets[0]);
    return false;
}

function tryFight (creep : Creep, target : Creep | Spawn | Structure)
{
    if(!target) return false;

    var err = creep.attack(target);
    if(err == ERR_NOT_IN_RANGE)
    {
        var err2 = creep.moveTo(target);
        if(err2 == ERR_NO_PATH)
        {
            creep.memory.fightTarget = undefined;
            return false;
        }
    }
    creep.memory.fightTarget = target.id;
    return true;
}*/

function tryFight (creep : Creep, target : any)
{
    if(!target) return false;

    var err = creep.attack(target);
    if(err == ERR_NOT_IN_RANGE)
    {
        var err2 = creep.moveTo(target);
    }
    creep.memory.fightTarget = target.id;
    return true;
}

function checkMoveIntoRoom(creep : Creep)
{
    if(creep.pos.x == 0)
    {
        creep.moveTo(1, creep.pos.y);
    }
    if(creep.pos.y == 0)
    {
        creep.moveTo(creep.pos.x, 1);
    }
    if(creep.pos.x == 49)
    {
        creep.moveTo(48, creep.pos.y);
    }
    if(creep.pos.y ==49)
    {
        creep.moveTo(creep.pos.x, 48);
    }
}