var spawnAmountTargets =
[
    {role:'harvester', count: 2, bodies: [[WORK, CARRY, MOVE], [WORK, WORK, CARRY, CARRY, MOVE], [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE]] },
    {role:'upgrader', count: 2, bodies: [[WORK, CARRY, MOVE], [WORK, WORK, CARRY, CARRY, MOVE], [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE]] },
    {role:'builder', count: 2, bodies: [[WORK, CARRY, MOVE], [WORK, WORK, CARRY, CARRY, MOVE], [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE]] },
    {role:'repair', count: 2, bodies: [[WORK, CARRY, MOVE], [WORK, WORK, CARRY, CARRY, MOVE], [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE]] },
    {role:'battlebro', count: 1, bodies: [[TOUGH, TOUGH, MOVE, ATTACK, ATTACK, ATTACK, MOVE, MOVE]]},
];

function getUnitCounts(room : Room)
{
    var creepCounts: { [id:string]: number } = {};
    var roomCreeps = <Creep[]>room.find(FIND_CREEPS);
    
    for(var creepKey in roomCreeps)
    {
        var creep = Game.creeps[roomCreeps[creepKey].name];
        if(creep == null || creep.memory == null) //filter only my creeps
            continue;
        var role = <string>creep.memory.role;
        if(creepCounts[role] == undefined || creepCounts[role] == null)
        {
            creepCounts[role] = 0;
        }
        creepCounts[role]++;
    }
    return creepCounts;
}

export function run() : void
{
    var roomSpawns: { [id:string]: Spawn[] } = {};
    
    for(var spawnKey in Game.spawns)
    {
        var spawn = Game.spawns[spawnKey];
        //console.log(spawn.room);
        //console.log(JSON.stringify(spawn.room));
        if(roomSpawns[spawn.room.name] == undefined)
        {
            roomSpawns[spawn.room.name] = [];
        }
        roomSpawns[spawn.room.name].push(spawn);
    }
    
    for(var room in Game.rooms)
    {
        var spawnArray = <Spawn[]>roomSpawns[room];
        var unitCounts = getUnitCounts(Game.rooms[room]);
        //console.log(JSON.stringify(unitCounts));
        
        var energy = Game.rooms[room].energyAvailable;

        for(var spawnKey in spawnArray)
        {
            var spawn = spawnArray[spawnKey];
            if(spawn == null || spawn == undefined)
                continue;
            if(!spawn.spawning)
            {
                continue;
            }
            var spawningRole = <string>Memory.creeps[spawn.spawning.name]["role"];
            
            unitCounts[spawningRole]++;
        }
       // console.log(spawnArray);
        for(var spawnKey in spawnArray)
        {
            var spawn = spawnArray[spawnKey];

            for(var roleTargetIndex in spawnAmountTargets)
            {
                var roleTarget = spawnAmountTargets[roleTargetIndex];
                var defecit = roleTarget.count - unitCounts[roleTarget.role];
                if(isNaN(defecit)) //none exist!
                    defecit = roleTarget.count;

                if(spawn.spawning == null && defecit > 0)
                {
                     //TODO: cache energy costs
                    var maxEnergy = spawn.room.energyCapacityAvailable;
                    var requiredEnergy = 0;
                    var bestBody : string[];
                    for(var bodyKey in roleTarget.bodies)
                    {
                        var body = roleTarget.bodies[bodyKey];
                        //console.log(body);
                        var bodyEnergy = 0;
                        for(var part in body)
                        {
                            bodyEnergy += BODYPART_COST[body[part]];
                        }
                        //todo: maybe not always the most expensive? hm..
                        if(bodyEnergy < maxEnergy && bodyEnergy > requiredEnergy)
                        {                            
                            requiredEnergy = bodyEnergy;
                            bestBody = body;
                        }
                    }
                    //console.log("Want to make: " + bestBody + " needs " + requiredEnergy + " have " + energy + " max: " + maxEnergy);
                    if(requiredEnergy <= energy && requiredEnergy > 0)
                    {
                        var id = roleTarget.role + getRandomID();
                        var output = spawn.createCreep(bestBody, id, { role: roleTarget.role});
                        console.log("Spawn creep attempt for ", id, " as ", roleTarget.role, "\n\tResult: ", output, "\n\t", body, "\n\t", requiredEnergy);
                        energy -= requiredEnergy;
                        unitCounts[roleTarget.role]++;
                        break; //go to next spawner.
                    }
                    /*if(harvestCt < 2)
                    {
                        console.log("trying harvester spawn: " + spawn.createCreep([WORK, WORK, CARRY, CARRY, MOVE], "Harvester" + Math.random(), {role: 'harvester'}));
                    }*/
                }
            }
        }
    }
}

function getRandomID() : string 
{
    var rand = Math.round(Math.random() * 9999);
    var stringRand = rand.toString();
    while(stringRand.length < 4)
    {
        stringRand = '0'+stringRand;
    }
    return stringRand;
}