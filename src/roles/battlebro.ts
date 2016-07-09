export function run(creep : Creep)
{
    //var targetRoom = <string>creep.memory.targetRoom;
    var targetRoom = "E41S19";
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
    if(!tryFightTower(creep))
    if(!tryFightCreep(creep))
    if(!tryFightBuildings(creep))
        console.log("nothing to fight");
        
}

function tryFightTower(creep : Creep)
{
    var bad = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
            filter : (s : Structure) => s.structureType == STRUCTURE_TOWER
        });
    return tryFight(creep, bad);
}

function tryFightCreep(creep : Creep)
{
    var bad = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
    return tryFight(creep, bad);
}

function tryFightBuildings(creep : Creep)
{
    var bad = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
            filter : (s : Structure) => s.structureType != STRUCTURE_ROAD
        });
    return tryFight(creep, bad);
}

function tryFight (creep : Creep, target : any)
{
    if(!target) return false;
    if(creep.attack(target) == ERR_NOT_IN_RANGE)
    {
        creep.moveTo(target);
    }
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