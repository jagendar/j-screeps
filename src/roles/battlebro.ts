export function run(creep : Creep)
{
    var targetRoom = <string>creep.memory.targetRoom;
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
    var path = creep.room.findExitTo(targetRoom);
    if(path == ERR_NO_PATH)
    {
        console.log("unable to reach target room: " + targetRoom);
        fightLocally(creep);
        return;
    }
    if(path == ERR_INVALID_ARGS)
    {
        console.log("Target room does not exist!");
        targetRoom = undefined;
        fightLocally(creep);
        return;
    }

    var exit : any = creep.pos.findClosestByRange(<number>path);
    creep.moveTo(exit);
    //TODO: should cache this location.
}

function fightLocally(creep : Creep)
{
    creep.say("Got a chip on my shoulder!");
}