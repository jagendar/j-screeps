

function prepDefense(room : Room)
{
    var roomData = <LookAtResultWithPos[]>room.lookForAtArea(LOOK_TERRAIN, 0, 0, 49, 49, true);
    prepWalls(room, roomData);
}

function prepWalls(room : Room, terrainData : LookAtResultWithPos[])
{
    for(var datumKey in terrainData)
    {
        var datum = terrainData[datumKey];
        //ok so a datum looks like:
        // {x: 5, y: 10, type: 'creep', creep: {...}},
        
        //TODO: get fill-areas near exits instead of blind walling
        if((datum.x == 2 || datum.y == 2 || datum.x == 47 || datum.y == 47) && datum.terrain != 'wall')
        {
            room.memory.spawnData.push({'x': datum.x, 'y': datum.y, 'building': STRUCTURE_WALL});
        }
    }
}

function doBuild(room : Room)
{
    if(!room.controller) return;
    if(!room.controller.my) return;

    if(room.controller.level < 2)
    {
        console.log("Controller less than 2.");
        return;
        //TODO: make this skip building types, not everything.
    }
    var sites = room.find(FIND_CONSTRUCTION_SITES).length;
    if(sites < 5)
    {
        for(var itemKey in room.memory.spawnData)
        {
            //TODO: skip items you're too low for
            var item = room.memory.spawnData[itemKey];
            if(room.lookForAt(LOOK_CONSTRUCTION_SITES, item.x, item.y).length || room.lookForAt(LOOK_STRUCTURES, item.x, item.y).length)
            {
                continue;
            }
            else
            {
                var output = room.createConstructionSite(item.x, item.y, item.building);
                if(output != 0)
                {
                    if(output == ERR_FULL)
                    {
                        break;   
                    }
                    else
                    {
                        var outputString = "";
                        
                        if(output == ERR_INVALID_TARGET)
                            outputString = "Invalid location - likely full or too close to entrance";
                        if(output == ERR_INVALID_ARGS)
                            outputString = "Invalid location - incorrect coordinates";
                        if(output == ERR_RCL_NOT_ENOUGH)
                            outputString = "Invalid structure. Room controller too low. " + item.building;
                        console.log("Building error: " + output + "@" + item.x + "," + item.y +  "  (" + outputString + ")");
                    }
                }
                break; //only queue one per frame. //TODO: this should queue in batches to better benefit from the checking we've done on the start already.
            }
        }
        
    }
}

export function buildDefense (room : Room)
{
    if(room.memory.spawnData == undefined)
    {
        room.memory.spawnData = [];
        console.log("Running defense prep code for room " + room);
        prepDefense(room);
    }
    doBuild(room);
}