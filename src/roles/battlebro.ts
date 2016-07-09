export function run(creep : Creep)
{
    //var targetRoom = <string>creep.memory.targetRoom;
    var targetRoom = "E40S19";
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
    var roomPos = new RoomPosition(25, 25, targetRoom);
    
    creep.moveTo(roomPos);
    //TODO: should cache this location.
}

function fightLocally(creep : Creep)
{
    creep.say("Got a chip on my shoulder!");
}