// ==UserScript==
// @name TW Map Tools
// @description Pengu's TW Map Tools
// @author Pengu
// @namespace https://github.com/pingudiogo
// @include https://*screen=map*
// @icon https://dspt.innogamescdn.com/asset/49a2a1f/graphic/icons/map2.png
// @version 0.1.1
// @updateURL https://github.com/pingudiogo/TribalWars/raw/master/Scripts/mapTools.js
// @downloadURL https://github.com/pingudiogo/TribalWars/raw/master/Scripts/mapTools.js
// ==/UserScript==

var bonusIds;
var mapFilters;
var ownVillageInfo;

run();

function run() {
    startConfig();
    setInterval(mapFilter, 100);
}

function mapFilter() {
    var villages = getVillages();
    applyMapFilters(villages);
}

function startConfig() {
    ownVillageInfo = getOwnVillageInfo();
    bonusIds = getBonusIds();
    mapFilters = createMapFilters();
}

function getOwnVillageInfo() {
    var xPos = TWMap.pos[0];
    var yPos = TWMap.pos[1];
    var village = TWMap.villages[xPos * 1000 + yPos];
    var ownVillageInfo = {
        pos: {
            x: xPos,
            y: yPos
        },
        id: village.id
    }
    return ownVillageInfo;
}

function getBonusIds() {
    var bonusIds = {};
    var bonus_data = TWMap.bonus_data;
    for (var key in bonus_data) {
        var data = bonus_data[key];
        var name = data.image.replace(/^.*[\\\/]/, '').split(".")[0];
        bonusIds[name] = key;
    }
    return bonusIds;
}

function createMapFilters() {
    var bonus = {};
    for (var key in bonusIds) {
        bonus[key] = false;
    }
    var mapFilters = {
        hidden: {
            bbs: false,
            bonus: bonus,
            players: false,
            attacked: true
        }
    }
    return mapFilters;
}

function applyMapFilters(villages) {
    for (var villageNum in villages) {
        var village = TWMap.villages[villageNum];
        var filter = false;
        var villageId = village.id;
        var villageElement = document.getElementById('map_village_' + villageId);
        if (villageElement != null /**&& villageElement.style.visibility != 'hidden'**/) {
            var attacked = checkAttacked(village);
            if (village.owner != 0) {
                if (mapFilters.hidden.players) {
                    filter = true;
                }
            } else {
                if (mapFilters.hidden.attacked && attacked) {
                    filter = true;
                }
            }
            if (filter) {
                villageElement.style.visibility = 'hidden';
                document.querySelectorAll('[id^=map_cmdicons_' + villageId + ']').forEach(cmd => cmd.style.visibility = 'hidden');
            }
        }
    }
}

function checkAttacked(village) {
    if (document.getElementById('map_cmdicons_' + village.id + '_0') != null || document.getElementById('map_cmdicons_' + village.id + '_1') != null) {
        return true;
    }
    return false;
}

function getVillages() {
    return TWMap.villages;
}


//document.querySelectorAll('[id^=map_village]').forEach(village => village.style.visibility = 'hidden');

