module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/**
	 * Application bootstrap.
	 * BEFORE CHANGING THIS FILE, make sure you read this:
	 * http://support.screeps.com/hc/en-us/articles/204825672-New-main-loop-architecture
	 *
	 * Write your code to GameManager class in ./src/start/game-manager.ts
	 */
	/// <reference path="../_reference.ts" />
	const game_manager_1 = __webpack_require__(1);
	/*
	* Singleton object. Since GameManager doesn't need multiple instances we can use it as singleton object.
	*/
	game_manager_1.GameManager.globalBootstrap();
	// This doesn't look really nice, but Screeps' system expects this method in main.js to run the application.
	// If we have this line, we can make sure that globals bootstrap and game loop work.
	// http://support.screeps.com/hc/en-us/articles/204825672-New-main-loop-architecture
	module.exports.loop = function () {
	    game_manager_1.GameManager.loop();
	};


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Builder = __webpack_require__(2);
	const Harvester = __webpack_require__(4);
	const Upgrader = __webpack_require__(5);
	const Repair = __webpack_require__(3);
	const BattleBro = __webpack_require__(6);
	const Tower = __webpack_require__(7);
	const StructurePlanner = __webpack_require__(8);
	const SpawnPlanner = __webpack_require__(9);
	/**
	 * Singleton object.
	 * Since singleton classes are considered anti-pattern in Typescript, we can effectively use namespaces.
	 * Namespace's are like internal modules in your Typescript application. Since GameManager doesn't need multiple instances
	 * we can use it as singleton.
	 */
	var GameManager;
	(function (GameManager) {
	    // this is called once on the initial load of the code; however, the code in
	    // screeps seems to reload quite frequently.  It could be useful to do some
	    // sort of pre-caching here
	    function globalBootstrap() {
	    }
	    GameManager.globalBootstrap = globalBootstrap;
	    function loop() {
	        for (var roomKey in Game.rooms) {
	            StructurePlanner.buildDefense(Game.rooms[roomKey]);
	        }
	        for (var buildingKey in Game.structures) {
	            var building = Game.structures[buildingKey];
	            if (building.structureType == STRUCTURE_TOWER) {
	                Tower.run(building);
	            }
	        }
	        //TODO: update this to repopulate creeps?
	        for (var i in Memory.creeps) {
	            if (!Game.creeps[i]) {
	                delete Memory.creeps[i];
	            }
	        }
	        for (var name in Game.creeps) {
	            var creep = Game.creeps[name];
	            if (creep.memory.role == 'harvester') {
	                Harvester.run(creep);
	            }
	            if (creep.memory.role == 'upgrader') {
	                Upgrader.run(creep);
	            }
	            if (creep.memory.role == 'builder') {
	                Builder.run(creep);
	            }
	            if (creep.memory.role == 'repair') {
	                Repair.run(creep);
	            }
	            if (creep.memory.role == 'battlebro') {
	                BattleBro.run(creep);
	            }
	        }
	        SpawnPlanner.run();
	    }
	    GameManager.loop = loop;
	})(GameManager = exports.GameManager || (exports.GameManager = {}));


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Repair = __webpack_require__(3);
	function run(creep) {
	    if (creep.memory.building && creep.carry.energy == 0) {
	        creep.memory.building = false;
	    }
	    if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	    }
	    if (creep.memory.building) {
	        var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
	        if (target) {
	            if (creep.build(target) == ERR_NOT_IN_RANGE) {
	                creep.moveTo(target);
	            }
	        }
	        else {
	            Repair.run(creep);
	        }
	    }
	    else {
	        var sources = creep.room.find(FIND_SOURCES);
	        if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
	            creep.moveTo(sources[0]);
	        }
	    }
	}
	exports.run = run;
	;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Harvest = __webpack_require__(4);
	function run(creep) {
	    if (creep.memory.building && creep.carry.energy == 0) {
	        creep.memory.building = false;
	        creep.memory.buildingTarget = null;
	    }
	    if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	    }
	    if (creep.memory.building) {
	        var newTarget = creep.memory.buildingTarget == undefined || creep.memory.buildingTarget == null;
	        if (!newTarget) {
	            var target = Game.getObjectById(creep.memory.buildingTarget);
	            if (target == null)
	                newTarget = true;
	            else if (target.hits == target.hitsMax)
	                newTarget = true;
	        }
	        if (newTarget) {
	            var targets = creep.room.find(FIND_STRUCTURES, { filter: (s) => {
	                    if (s.structureType == STRUCTURE_ROAD)
	                        return s.hits < s.hitsMax * .5;
	                    return s.hits < s.hitsMax;
	                }
	            });
	            targets = targets.sort((a, b) => { return a.hits - b.hits; });
	            //TODO: sort by closeness
	            if (targets.length)
	                creep.memory.buildingTarget = targets[0].id;
	        }
	        if (creep.memory.buildingTarget) {
	            var target = Game.getObjectById(creep.memory.buildingTarget);
	            //creep.say(target.pos.x + ", " + target.pos.y);
	            if (creep.repair(target) == ERR_NOT_IN_RANGE) {
	                creep.moveTo(target);
	            }
	        }
	        else {
	            Harvest.run(creep);
	        }
	    }
	    else {
	        var sources = creep.room.find(FIND_SOURCES);
	        if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
	            creep.moveTo(sources[0]);
	        }
	    }
	}
	exports.run = run;


/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	function run(creep) {
	    if (creep.memory.loading == undefined)
	        creep.memory.loading = true;
	    if (creep.carry.energy == 0)
	        creep.memory.loading = true;
	    if (creep.carry.energy == creep.carryCapacity)
	        creep.memory.loading = false;
	    if (creep.memory.loading) {
	        var source = creep.pos.findClosestByPath(FIND_SOURCES, {
	            filter: (source) => {
	                return source.energy >= creep.carryCapacity;
	            }
	        });
	        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
	            creep.moveTo(source);
	        }
	    }
	    else {
	        var structTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
	            filter: (structure) => {
	                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) &&
	                    structure.energy < structure.energyCapacity;
	            }
	        });
	        var creepTarget;
	        if (!structTarget) {
	            creepTarget = creep.pos.findClosestByPath(FIND_CREEPS, {
	                filter: (creep) => {
	                    return creep != undefined && creep.memory != undefined && (creep.memory.role == 'upgrader' || creep.memory.role == 'builder' || creep.memory.role == 'repair');
	                }
	            });
	        }
	        var target;
	        if (structTarget) {
	            target = structTarget;
	        }
	        else if (creepTarget) {
	            target = creepTarget;
	        }
	        if (target) {
	            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	                creep.moveTo(target);
	            }
	        }
	    }
	    if (creep.memory.role == 'harvester') {
	        creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
	    }
	}
	exports.run = run;


/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	function run(creep) {
	    if (creep.memory.upgrading && creep.carry.energy == 0) {
	        creep.memory.upgrading = false;
	    }
	    if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true;
	    }
	    if (creep.memory.upgrading) {
	        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
	            creep.moveTo(creep.room.controller);
	        }
	    }
	    else {
	        var sources = creep.room.find(FIND_SOURCES);
	        if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
	            creep.moveTo(sources[0]);
	        }
	    }
	}
	exports.run = run;


/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	function run(creep) {
	    //var targetRoom = <string>creep.memory.targetRoom;
	    var targetRoom = "E40S19";
	    if (!targetRoom) {
	        //just look around this room I guess, since you're listless as fuck.
	        fightLocally(creep);
	        return;
	    }
	    var targetRoomAsRoom = Game.rooms[targetRoom];
	    if (creep.room != targetRoomAsRoom) {
	        pathToRoom(creep, targetRoom);
	    }
	    else {
	        //find bros to fight!
	        fightLocally(creep);
	    }
	}
	exports.run = run;
	;
	function pathToRoom(creep, targetRoom) {
	    var roomPos = new RoomPosition(40, 25, targetRoom);
	    creep.moveTo(roomPos);
	    //TODO: should cache this location.
	}
	function fightLocally(creep) {
	    checkMoveIntoRoom(creep);
	    creep.say("Got a chip on my shoulder!");
	}
	function checkMoveIntoRoom(creep) {
	    if (creep.pos.x == 0) {
	        creep.moveTo(1, creep.pos.y);
	    }
	    if (creep.pos.y == 0) {
	        creep.moveTo(creep.pos.x, 1);
	    }
	    if (creep.pos.x == 49) {
	        creep.moveTo(48, creep.pos.y);
	    }
	    if (creep.pos.y == 49) {
	        creep.moveTo(creep.pos.x, 48);
	    }
	}


/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	function run(tower) {
	    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
	    if (closestHostile) {
	        tower.attack(closestHostile);
	    }
	}
	exports.run = run;


/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";
	function prepDefense(room) {
	    var roomData = room.lookForAtArea(LOOK_TERRAIN, 0, 0, 49, 49, true);
	    prepWalls(room, roomData);
	}
	function prepWalls(room, terrainData) {
	    for (var datumKey in terrainData) {
	        var datum = terrainData[datumKey];
	        //ok so a datum looks like:
	        // {x: 5, y: 10, type: 'creep', creep: {...}},
	        //TODO: get fill-areas near exits instead of blind walling
	        if ((datum.x == 2 || datum.y == 2 || datum.x == 47 || datum.y == 47) && datum.terrain != 'wall') {
	            room.memory.spawnData.push({ 'x': datum.x, 'y': datum.y, 'building': STRUCTURE_WALL });
	        }
	    }
	}
	function doBuild(room) {
	    if (room.controller.level < 2) {
	        console.log("Controller less than 2.");
	        return;
	    }
	    var sites = room.find(FIND_CONSTRUCTION_SITES).length;
	    if (sites < 5) {
	        for (var itemKey in room.memory.spawnData) {
	            //TODO: skip items you're too low for
	            var item = room.memory.spawnData[itemKey];
	            if (room.lookForAt(LOOK_CONSTRUCTION_SITES, item.x, item.y).length || room.lookForAt(LOOK_STRUCTURES, item.x, item.y).length) {
	                continue;
	            }
	            else {
	                var output = room.createConstructionSite(item.x, item.y, item.building);
	                if (output != 0) {
	                    if (output == ERR_FULL) {
	                        break;
	                    }
	                    else {
	                        var outputString = "";
	                        if (output == ERR_INVALID_TARGET)
	                            outputString = "Invalid location - likely full or too close to entrance";
	                        if (output == ERR_INVALID_ARGS)
	                            outputString = "Invalid location - incorrect coordinates";
	                        if (output == ERR_RCL_NOT_ENOUGH)
	                            outputString = "Invalid structure. Room controller too low. " + item.building;
	                        console.log("Building error: " + output + "@" + item.x + "," + item.y + "  (" + outputString + ")");
	                    }
	                }
	                break; //only queue one per frame. //TODO: this should queue in batches to better benefit from the checking we've done on the start already.
	            }
	        }
	    }
	}
	function buildDefense(room) {
	    if (!room.controller)
	        return;
	    if (!room.controller.my)
	        return;
	    if (room.memory.spawnData == undefined) {
	        room.memory.spawnData = [];
	        console.log("Running defense prep code for room " + room);
	        prepDefense(room);
	    }
	    doBuild(room);
	}
	exports.buildDefense = buildDefense;


/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	var spawnAmountTargets = [
	    { role: 'harvester', count: 2, bodies: [[WORK, CARRY, MOVE], [WORK, WORK, CARRY, CARRY, MOVE], [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE]] },
	    { role: 'upgrader', count: 2, bodies: [[WORK, CARRY, MOVE], [WORK, WORK, CARRY, CARRY, MOVE], [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE]] },
	    { role: 'builder', count: 2, bodies: [[WORK, CARRY, MOVE], [WORK, WORK, CARRY, CARRY, MOVE], [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE]] },
	    { role: 'repair', count: 2, bodies: [[WORK, CARRY, MOVE], [WORK, WORK, CARRY, CARRY, MOVE], [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE]] },
	];
	function getUnitCounts(room) {
	    var creepCounts = {};
	    var roomCreeps = room.find(FIND_CREEPS);
	    for (var creepKey in roomCreeps) {
	        var creep = Game.creeps[roomCreeps[creepKey].name];
	        if (creep == null || creep.memory == null)
	            continue;
	        var role = creep.memory.role;
	        if (creepCounts[role] == undefined || creepCounts[role] == null) {
	            creepCounts[role] = 0;
	        }
	        creepCounts[role]++;
	    }
	    return creepCounts;
	}
	function run() {
	    var roomSpawns = {};
	    for (var spawnKey in Game.spawns) {
	        var spawn = Game.spawns[spawnKey];
	        //console.log(spawn.room);
	        //console.log(JSON.stringify(spawn.room));
	        if (roomSpawns[spawn.room.name] == undefined) {
	            roomSpawns[spawn.room.name] = [];
	        }
	        roomSpawns[spawn.room.name].push(spawn);
	    }
	    for (var room in Game.rooms) {
	        var spawnArray = roomSpawns[room];
	        var unitCounts = getUnitCounts(Game.rooms[room]);
	        //console.log(JSON.stringify(unitCounts));
	        var energy = Game.rooms[room].energyAvailable;
	        for (var spawnKey in spawnArray) {
	            var spawn = spawnArray[spawnKey];
	            if (spawn == null || spawn == undefined)
	                continue;
	            if (!spawn.spawning) {
	                continue;
	            }
	            var spawningRole = Memory.creeps[spawn.spawning.name]["role"];
	            unitCounts[spawningRole]++;
	        }
	        // console.log(spawnArray);
	        for (var spawnKey in spawnArray) {
	            var spawn = spawnArray[spawnKey];
	            for (var roleTargetIndex in spawnAmountTargets) {
	                var roleTarget = spawnAmountTargets[roleTargetIndex];
	                var defecit = roleTarget.count - unitCounts[roleTarget.role];
	                if (isNaN(defecit))
	                    defecit = roleTarget.count;
	                if (spawn.spawning == null && defecit > 0) {
	                    //TODO: cache energy costs
	                    var maxEnergy = spawn.room.energyCapacityAvailable;
	                    var requiredEnergy = 0;
	                    var bestBody;
	                    for (var bodyKey in roleTarget.bodies) {
	                        var body = roleTarget.bodies[bodyKey];
	                        //console.log(body);
	                        var bodyEnergy = 0;
	                        for (var part in body) {
	                            bodyEnergy += BODYPART_COST[body[part]];
	                        }
	                        //todo: maybe not always the most expensive? hm..
	                        if (bodyEnergy < maxEnergy && bodyEnergy > requiredEnergy) {
	                            requiredEnergy = bodyEnergy;
	                            bestBody = body;
	                        }
	                    }
	                    //console.log("Want to make: " + bestBody + " needs " + requiredEnergy + " have " + energy + " max: " + maxEnergy);
	                    if (requiredEnergy <= energy && requiredEnergy > 0) {
	                        var id = roleTarget.role + " " + getRandomID();
	                        var output = spawn.createCreep(bestBody, id, { role: roleTarget.role });
	                        console.log("Spawn creep attempt for ", id, " as ", roleTarget.role, "\n\tResult: ", output, "\n\t", body);
	                        energy -= requiredEnergy;
	                        unitCounts[roleTarget.role]++;
	                        break; //go to next spawner.
	                    }
	                }
	            }
	        }
	    }
	}
	exports.run = run;
	function getRandomID() {
	    var rand = Math.round(Math.random() * 9999);
	    var stringRand = rand.toString();
	    while (stringRand.length < 4) {
	        stringRand = '0' + stringRand;
	    }
	    return stringRand;
	}


/***/ }
/******/ ]);