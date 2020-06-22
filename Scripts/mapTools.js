// ==UserScript==
// @name TW Map Tools
// @description Pengu's TW Map Tools
// @author Pengu
// @namespace https://github.com/pingudiogo
// @include https://*screen=map*
// @icon https://dspt.innogamescdn.com/asset/49a2a1f/graphic/icons/map2.png
// @version 0.0.1
// @updateURL https://github.com/pingudiogo/TribalWars/raw/master/Scripts/mapTools.js
// @downloadURL https://github.com/pingudiogo/TribalWars/raw/master/Scripts/mapTools.js
// ==/UserScript==

var mapFilters = {
    hideBBs: false,
    hidePlayers: false
}

setInterval(run, 10);

function run() {
    var villages = getVillages();
    applyMapFilters(villages);
}

function applyMapFilters(villages) {
    for (var villageNum in villages) {
        var village = TWMap.villages[villageNum]
        if (village.bonus_id != 5) {
            var villageElement = document.getElementById('map_village_' + village.id);
            if (villageElement != null) {
                villageElement.style.visibility = 'hidden';
            }
        }
    }
}

function getVillages() {
    return TWMap.villages;
}


//document.querySelectorAll('[id^=map_village]').forEach(village => village.style.visibility = 'hidden');

