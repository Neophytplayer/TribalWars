// ==UserScript==
// @name Farm
// @description Pengu's best auto farmer
// @author Pengu
// @namespace https://github.com/pingudiogo
// @include https://*screen=am_farm*
// @icon https://dspt.innogamescdn.com/asset/70e1acd/graphic/icons/farm_assistent.png
// @version 3.2.0
// @updateURL https://github.com/pingudiogo/TribalWars/raw/master/Scripts/farm.js
// @downloadURL https://github.com/pingudiogo/TribalWars/raw/master/Scripts/farm.js
// ==/UserScript==

var farmSettingsVersion = "1.1";
var error = false;
var assetVersion = TribalWars.getGameData().version.split(" ")[0];
var assetUrl = "https://dspt.innogamescdn.com/asset/";
var farmingStatus = "uninitialized";
var statusMessage = "";

var possibleStatus = ["uninitialized", "setup", "farming", "stopped"]

var reportColor = {
	blue: "/graphic/dots/blue.png",
	green: "/graphic/dots/green.png",
	yellow: "/graphic/dots/yellow.png",
	red: "/graphic/dots/red.png",
	redBlue: "/graphic/dots/red_blue.png",
	redYellow: "/graphic/dots/red_yellow.png"
}

run();

function run() {
	setStatus("setup","Started setup");
	var farmSettings = loadSettings();
	createSettingsForm(farmSettings);
	startFarming(farmSettings);
}

function setStatus(status, message) {
	farmingStatus = status;
	statusMessage = message;
	console.log("Status: \'" + farmingStatus + "\', Message: \'" + statusMessage + "\'");
}

function createModelsSettings() {
	var modelsSettings = [{}, {}, {}];
	var i = 0;
	for (i = 0; i < 3; i++) {
		modelsSettings[i].model = String.fromCharCode(97 + i);
		modelsSettings[i].maxWall = 0;
		modelsSettings[i].maxDistance = 0;
		modelsSettings[i].fullLoot = true;
		modelsSettings[i].partialLoot = true;
		modelsSettings[i].reportColor = {
			blue: false,
			green: false,
			yellow: false,
			red: false,
			redBlue: false,
			redYellow: false
		}
		modelsSettings[i].active = false;
	}
	return modelsSettings;
}

function createFarmSettings() {
	var modelsSettings = createModelsSettings();
	var farmSettings = {
		refreshTime: 60000,
		switchVillages: true,
		timeBetweenAttacks: 200,
		active: false,
		version: farmSettingsVersion,
		modelsSettings: modelsSettings
	}
	return farmSettings;
}

function patchFarmSettings(farmSettings) {
	var newFarmSettings = createFarmSettings();
	for (var setting in newFarmSettings) {
		if (setting == "modelsSettings") {
			var newModelsSettings = newFarmSettings[setting];
			var modelsSettings = farmSettings[setting];
			for (var i = 0; i < 3; i++) {
				var newModelSettings = newModelsSettings[i];
				var modelSettings = modelsSettings[i];
				for (var modelSetting in newModelSettings) {
					if (modelSettings[modelSetting] == null) {
						modelSettings[modelSetting] = newModelSettings[modelSetting];
					}
				}
			}
			continue;
		}
		if (farmSettings[setting] == null) {
			farmSettings[setting] = newFarmSettings[setting];
		}
	}
	farmSettings.version = farmSettingsVersion;
}

function loadSettings() {
	setStatus("setup","Loading settings");
	var farmSettings = getFarmSettings();
	if (farmSettings == null) {
		console.log("Creating farm settings!");
		farmSettings = createFarmSettings();
	} else if (farmSettings.version != farmSettingsVersion) {
		console.log("Patching settings to new version!");
		patchFarmSettings(farmSettings);
	}
	saveFarmSettings(farmSettings);
	return farmSettings;
}

function setActive(value, farmSettings) {
	farmSettings.active = value;
	saveFarmSettings(farmSettings);
	if (value && farmingStatus == "stopped") {
		startFarming(farmSettings);
	}
}

function saveFarmSettings(farmSettings) {
	localStorage.setItem('farmSettings', JSON.stringify(farmSettings));
}

function updateFarmSettings(farmSettings) {
	//Read Models Settings
	var i;
	for (i = 0; i < 3; i++) {
		var model = String.fromCharCode(97 + i);

		var form = document.getElementsByName(model + "FarmForm")[0];
		var inputsRow = form.getElementsByTagName('tr')[1];
		var inputs = inputsRow.getElementsByTagName("td");
		var modelsSettings = farmSettings.modelsSettings;
		var modelSettings = modelsSettings[i];
		var wall = parseInt(inputsRow.querySelector('input[name="maxWall"]').value);
		if (wall == NaN || wall == null) {
			alert("Maximum wall level for model " + model.toUpperCase() + " must be set!");
			return;
		}
		modelSettings.maxWall = wall;
		var distance = parseFloat(inputsRow.querySelector('input[name="maxDistance"]').value);
		if (distance == NaN || distance == null) {
			alert("Maximum distance for model " + model.toUpperCase() + " must be set!");
			return;
		}
		modelSettings.maxDistance = distance;
		modelSettings.fullLoot = inputsRow.querySelector('input[name="fullLoot"]').checked;
		modelSettings.partialLoot = inputsRow.querySelector('input[name="partialLoot"]').checked;

		for (var color in reportColor) {
			modelSettings.reportColor[color] = inputsRow.querySelector('input[name="' + color + 'Attack"]').checked;
		}

		modelSettings.active = inputsRow.querySelector('input[name="modelOn"]').checked;
	}

	farmSettings.refreshTime = parseInt(document.getElementById("refreshTimeInput").value);
	farmSettings.timeBetweenAttacks = parseInt(document.getElementById("timeBetweenAttacksInput").value);
	farmSettings.switchVillages = document.getElementById("switchVillagesInput").checked;

	//Save settings to local storage
	saveFarmSettings(farmSettings);
	alert("Settings for farming assistant saved successfully!");
}

function resetSettings(farmSettings) {
	farmSettings = createFarmSettings();
	saveFarmSettings(farmSettings);
	alert("Settings for farming assistant were reset to default values! Page will now refresh!");
	window.location.reload();
}

function getFarmSettings() {
	var farmSettings = JSON.parse(localStorage.getItem('farmSettings'));
	return farmSettings;
}

function createSettingsForm(farmSettings) {
	setStatus("setup","Creating settings form");
	var modelsSettings = farmSettings.modelsSettings;
	var assTable = document.getElementById('content_value'); //Get farm assistant main table
	var assTitle = assTable.getElementsByTagName('h3')[0];

	var newDiv = document.createElement("div");
	newDiv.setAttribute('class', 'vis');
	assTitle.parentNode.insertBefore(newDiv, assTitle.nextSibling);

	var fTitle = document.createElement("h4");
	fTitle.textContent = "AutoFarmer Settings";
	newDiv.appendChild(fTitle);

	var fActiveDiv = document.createElement("div");
	fActiveDiv.setAttribute('style', 'display:inline-block; position:absolute; right:3px;');
	fTitle.appendChild(fActiveDiv);

	var fActiveLabel = document.createElement("label");
	fActiveLabel.setAttribute('for', 'fActiveInput');
	fActiveLabel.setAttribute('style', 'padding-right:10px;');
	fActiveLabel.innerHTML = "On/Off";
	fActiveDiv.appendChild(fActiveLabel);

	var fActiveCheckBox = document.createElement("input");
	fActiveCheckBox.setAttribute('id', 'fActiveInput');
	fActiveCheckBox.setAttribute('type', 'checkbox');
	fActiveCheckBox.setAttribute('name', 'fActiveInput');
	fActiveCheckBox.checked = farmSettings.active;
	fActiveCheckBox.onclick = function() {
		setActive(fActiveCheckBox.checked, farmSettings);
	}
	fActiveDiv.appendChild(fActiveCheckBox);

	var scriptSettings = document.createElement("div")
	scriptSettings.setAttribute('id', 'scriptSettings');
	scriptSettings.setAttribute('style', 'display:inline-block; background-color:#f4e4bc; margin: 2px 2px 0px 2px;');
	newDiv.appendChild(scriptSettings);

	var scriptSettingsSplit1 = document.createElement("div");
	scriptSettingsSplit1.setAttribute('style', 'float:left;');
	scriptSettings.appendChild(scriptSettingsSplit1);

	var refreshTimeSpan = document.createElement("span");
	scriptSettingsSplit1.appendChild(refreshTimeSpan);

	var refreshTimeInputLabel = document.createElement("label");
	refreshTimeInputLabel.setAttribute('for', "refreshTimeInput");
	refreshTimeInputLabel.setAttribute('style', "padding-right:10px;");
	refreshTimeInputLabel.innerHTML = "Refresh time in ms:";
	refreshTimeSpan.appendChild(refreshTimeInputLabel);

	var refreshTimeInput = document.createElement("input");
	refreshTimeInput.setAttribute('id', "refreshTimeInput");
	refreshTimeInput.setAttribute('type', "number");
	refreshTimeInput.setAttribute('name', "refreshTime");
	refreshTimeInput.setAttribute('size', "3");
	refreshTimeInput.setAttribute('value', farmSettings.refreshTime);
	refreshTimeSpan.appendChild(refreshTimeInput);

	scriptSettingsSplit1.appendChild(document.createElement("br"));

	var timeBetweenAttacksSpan = document.createElement("span");
	scriptSettingsSplit1.appendChild(timeBetweenAttacksSpan);

	var timeBetweenAttacksLabel = document.createElement("label");
	timeBetweenAttacksLabel.setAttribute('for', "timeBetweenAttacksInput");
	timeBetweenAttacksLabel.setAttribute('style', "padding-right:10px;");
	timeBetweenAttacksLabel.innerHTML = "Time between attacks in ms:";
	timeBetweenAttacksSpan.appendChild(timeBetweenAttacksLabel);

	var timeBetweenAttacksInput = document.createElement("input");
	timeBetweenAttacksInput.setAttribute('id', "timeBetweenAttacksInput");
	timeBetweenAttacksInput.setAttribute('type', "number");
	timeBetweenAttacksInput.setAttribute('name', "timeBetweenAttacks");
	timeBetweenAttacksInput.setAttribute('size', "3");
	timeBetweenAttacksInput.setAttribute('value', farmSettings.timeBetweenAttacks);
	timeBetweenAttacksSpan.appendChild(timeBetweenAttacksInput);

	var scriptSettingsSplit2 = document.createElement("div");
	scriptSettingsSplit2.setAttribute('style', 'float:left; padding-left: 10px;');
	scriptSettings.appendChild(scriptSettingsSplit2);

	var switchVillagesSpan = document.createElement("span");
	scriptSettingsSplit2.appendChild(switchVillagesSpan);

	var switchVillagesLabel = document.createElement("label");
	switchVillagesLabel.setAttribute('for', "switchVillagesInput");
	switchVillagesLabel.setAttribute('style', "padding-right:10px;");
	switchVillagesLabel.innerHTML = "Switch villages:";
	switchVillagesSpan.appendChild(switchVillagesLabel);

	var switchVillagesInput = document.createElement("input");
	switchVillagesInput.setAttribute('id', "switchVillagesInput");
	switchVillagesInput.setAttribute('type', "checkbox");
	switchVillagesInput.setAttribute('name', "switchVillages");
	switchVillagesInput.checked = farmSettings.switchVillages;
	switchVillagesSpan.appendChild(switchVillagesInput);

	var i;
	for (i = 0; i < 3; i++) {
		var modelSettings = modelsSettings[i];
		var model = modelSettings.model;

		var settForm = document.createElement("form");
		settForm.setAttribute('name', model + "FarmForm");
		newDiv.appendChild(settForm);

		var tableF = document.createElement("table");
		tableF.setAttribute('class', "vis");
		tableF.setAttribute('width', "100%");
		settForm.appendChild(tableF);

		var tableBody = document.createElement("tbody");
		tableF.appendChild(tableBody);

		var tableRow1 = document.createElement("tr");
		tableF.appendChild(tableRow1);

		// Create icon for each farm model

		var farmIconTd = document.createElement("td");
		farmIconTd.setAttribute('rowspan', "2");
		farmIconTd.setAttribute('align', "center");
		farmIconTd.setAttribute('width', "10%");
		tableRow1.appendChild(farmIconTd);

		var farmIcon = document.createElement("a");
		farmIcon.setAttribute('class', "farm_icon farm_icon_" + model + " decoration");
		/*farmIcon.setAttribute('href', "#");
		farmIcon.setAttribute('onclick', "return false;");*/
		farmIconTd.appendChild(farmIcon);

		// Create settings now

		var wallTh = document.createElement("th");
		wallTh.setAttribute('style', "text-align:center");
		wallTh.setAttribute('width', "35");
		tableRow1.appendChild(wallTh);

		var wallImage = document.createElement("img");
		wallImage.setAttribute('src', assetUrl + assetVersion + "/graphic/buildings/wall.png");
		wallImage.setAttribute('class', "");
		wallImage.setAttribute('title', "Max Wall Level");
		wallTh.appendChild(wallImage);

		var distTh = document.createElement("th");
		distTh.setAttribute('style', "text-align:center");
		distTh.setAttribute('width', "35");
		tableRow1.appendChild(distTh);

		var distImage = document.createElement("img");
		distImage.setAttribute('src', assetUrl + assetVersion + "/graphic/rechts.png");
		distImage.setAttribute('class', "");
		distImage.setAttribute('title', "Max Distance");
		distTh.appendChild(distImage);

		var fullResTh = document.createElement("th");
		fullResTh.setAttribute('style', "text-align:center");
		fullResTh.setAttribute('width', "35");
		tableRow1.appendChild(fullResTh);

		var fullResImage = document.createElement("img");
		fullResImage.setAttribute('src', assetUrl + assetVersion + "/graphic/max_loot/1.png");
		fullResImage.setAttribute('class', "");
		fullResImage.setAttribute('title', "Full Loot");
		fullResTh.appendChild(fullResImage);

		var emptyResTh = document.createElement("th");
		emptyResTh.setAttribute('style', "text-align:center");
		emptyResTh.setAttribute('width', "35");
		tableRow1.appendChild(emptyResTh);

		var emptyResImage = document.createElement("img");
		emptyResImage.setAttribute('src', assetUrl + assetVersion + "/graphic/max_loot/0.png");
		emptyResImage.setAttribute('class', "");
		emptyResImage.setAttribute('title', "Parcial Loot");
		emptyResTh.appendChild(emptyResImage);

		//Add report colors' collumns
		for (var color in reportColor) {
			var colorTh = document.createElement("th");
			colorTh.setAttribute('style', "text-align:center");
			colorTh.setAttribute('width', "35");
			tableRow1.appendChild(colorTh);

			var colorImg = document.createElement("img");
			colorImg.setAttribute('src', assetUrl + assetVersion + reportColor[color]);
			colorImg.setAttribute('class', "");
			colorImg.setAttribute('title', "Attack when report " + color);
			colorTh.appendChild(colorImg);
		}

		var modelOnTh = document.createElement("th");
		modelOnTh.setAttribute('style', "text-align:center");
		modelOnTh.setAttribute('width', "35");
		tableRow1.appendChild(modelOnTh);

		var modelOnImage = document.createElement("img");
		modelOnImage.setAttribute('src', assetUrl + assetVersion + "/graphic/quests/check.png");
		modelOnImage.setAttribute('class', "");
		modelOnImage.setAttribute('title', "Model Active");
		modelOnTh.appendChild(modelOnImage);

		// Row2

		var tableRow2 = document.createElement("tr");
		tableF.appendChild(tableRow2);

		var wallTd = document.createElement("td");
		wallTd.setAttribute('align', "center");
		tableRow2.appendChild(wallTd);

		var wallInput = document.createElement("input");
		wallInput.setAttribute('type', "number");
		wallInput.setAttribute('name', "maxWall");
		wallInput.setAttribute('size', "3");
		wallInput.setAttribute('value', modelSettings.maxWall);
		wallTd.appendChild(wallInput);

		var distTd = document.createElement("td");
		distTd.setAttribute('align', "center");
		tableRow2.appendChild(distTd);

		var distInput = document.createElement("input");
		distInput.setAttribute('type', "number");
		distInput.setAttribute('name', "maxDistance");
		distInput.setAttribute('size', "3");
		distInput.setAttribute('value', modelSettings.maxDistance);
		distTd.appendChild(distInput);

		var fullResTd = document.createElement("td");
		fullResTd.setAttribute('align', "center");
		tableRow2.appendChild(fullResTd);

		var fullResInput = document.createElement("input");
		fullResInput.setAttribute('type', "checkbox");
		fullResInput.setAttribute('name', "fullLoot");
		fullResInput.setAttribute('size', "3");
		fullResInput.checked = modelSettings.fullLoot;
		fullResTd.appendChild(fullResInput);

		var emptyResTd = document.createElement("td");
		emptyResTd.setAttribute('align', "center");
		tableRow2.appendChild(emptyResTd);

		var emptyResInput = document.createElement("input");
		emptyResInput.setAttribute('type', "checkbox");
		emptyResInput.setAttribute('name', "partialLoot");
		emptyResInput.setAttribute('size', "3");
		emptyResInput.checked = modelSettings.partialLoot;
		emptyResTd.appendChild(emptyResInput);

		for (var color in reportColor) {
			var colorTd = document.createElement("td");
			colorTd.setAttribute('align', "center");
			tableRow2.appendChild(colorTd);

			var colorInput = document.createElement("input");
			colorInput.setAttribute('type', "checkbox");
			colorInput.setAttribute('name', color + "Attack");
			colorInput.setAttribute('size', "3");
			colorInput.checked = modelSettings.reportColor[color];
			colorTd.appendChild(colorInput);
		}

		var modelOnTd = document.createElement("td");
		modelOnTd.setAttribute('align', "center");
		tableRow2.appendChild(modelOnTd);

		var modelOnInput = document.createElement("input");
		modelOnInput.setAttribute('type', "checkbox");
		modelOnInput.setAttribute('name', "modelOn");
		modelOnInput.setAttribute('size', "3");
		modelOnInput.checked = modelSettings.active;
		modelOnTd.appendChild(modelOnInput);
	}

	// Create a button to save farm settings

	var saveIconDiv = document.createElement("div");
	saveIconDiv.setAttribute('class', "vis_item");
	saveIconDiv.setAttribute('align', "center");
	newDiv.appendChild(saveIconDiv);

	var saveIcon = document.createElement("input");
	saveIcon.setAttribute('type', "button");
	saveIcon.setAttribute('class', "btn");
	saveIcon.setAttribute('value', "Save Settings");
	saveIcon.onclick = function () {
		updateFarmSettings(farmSettings);
	};
	saveIconDiv.appendChild(saveIcon);

	var resetIcon = document.createElement("input");
	resetIcon.setAttribute('type', "button");
	resetIcon.setAttribute('class', "btn");
	resetIcon.setAttribute('value', "Reset Settings");
	resetIcon.onclick = function () {
		resetSettings(farmSettings);
	};
	saveIconDiv.appendChild(resetIcon);
}

function getVillages() {
	var villages = [];
	var plunderTable = document.getElementById('plunder_list');
	var plunderTableLines = plunderTable.childNodes[1].getElementsByTagName('tr');
	var i;
	var j = 0;
	for (i = 2; i < plunderTableLines.length; i++) {
		if (typeof plunderTableLines[i].attributes.style !== 'undefined') {
			continue;
		}
		var villageId = plunderTableLines[i].id;
		var plunderLine = plunderTableLines[i].getElementsByTagName('td');
		var maxLoot = "none";
		var maxLootImg = plunderLine[2].firstElementChild;
		if (maxLootImg != null) {
			if (maxLootImg.getAttribute("src").includes("0.png")) {
				maxLoot = "partial";
			} else if (maxLootImg.getAttribute("src").includes("1.png")) {
				maxLoot = "full";
			}
		}
		var villageWall = plunderLine[6].textContent;
		var villageDist = plunderLine[7].textContent;
		var intVillageWall;
		if (villageWall != "?") {
			intVillageWall = parseInt(villageWall);
		} else {
			intVillageWall = -1;
		}
		var lastAttackImg = plunderLine[1].firstElementChild.getAttribute("src");
		var lastAttack;
		for (var color in reportColor) {
			if (lastAttackImg.includes(reportColor[color])) {
				lastAttack = color;
			}
		}
		var farmA = plunderTableLines[i].getElementsByClassName("farm_icon_a")[0];
		var farmB = plunderTableLines[i].getElementsByClassName("farm_icon_b")[0];
		var farmC = plunderTableLines[i].getElementsByClassName("farm_icon_c")[0];
		villages[j] = {
			id: villageId,
			maxLoot: maxLoot,
			wall: intVillageWall,
			distance: parseFloat(villageDist),
			lastAttack: lastAttack,
			farmA: {
				element: farmA,
				isLocked: checkFarmLocked(farmA)
			},
			farmB: {
				element: farmB,
				isLocked: checkFarmLocked(farmB)
			},
			farmC: {
				element: farmC,
				isLocked: checkFarmLocked(farmC)
			},
			line: plunderTableLines[i]
		}
		j++;
	}
	return villages;
}

function checkFarmLocked(farmElement) {
	if (farmElement == null || typeof farmElement === 'undefined') {
		return true;
	}
	return farmElement.classList.contains("start_locked");
}

async function startFarming(farmSettings) {
	if (!farmSettings.active) {
		setStatus("stopped","Farming not active");
		return;
	}
	setStatus("farming","Started farming");
	var f;
	var villageSwitch = document.getElementById("village_switch_right");
	if (farmSettings.switchVillages && villageSwitch != null) {
		f = function () {
			villageSwitch.getElementsByTagName("span")[0].click();
		};
	} else {
		f = function () {
			window.location.reload();
		};
	}
	setInterval(f, farmSettings.refreshTime);
	var maxAttempts = 4;
	var i = 0;
	do {
		if (!farmSettings.active) {
			setStatus("stopped","Farming not active");
			return;
		}
		var villages = getVillages();
		await farmVillages(villages, farmSettings);
		i++;
	} while (villages.length > 0 && !error && i < maxAttempts);
	setStatus("stopped","Waiting to reload");
}

async function farmVillages(villages, farmSettings) {
	var i;
	for (i = 0; i < villages.length; i++) {
		if (!farmSettings.active) {
			return;
		}
		var modelChosen = chooseModel(villages[i], farmSettings.modelsSettings);
		var farm;
		var isValid = true;
		switch (modelChosen) {
			case "a":
				farm = villages[i].farmA;
				break;
			case "b":
				farm = villages[i].farmB;
				break;
			case "c":
				farm = villages[i].farmC;
				break;
			default:
				isValid = false;
				break;
		}
		if (isValid && !farm.isLocked) {
			farm.element.click();
			if (checkError()) {
				error = true;
				window.location.reload();
				return;
			}
			await sleep(farmSettings.timeBetweenAttacks);
		} else {
			//villages[i].line.remove();
		}
	}
}

function chooseModel(village, modelsSettings) {
	var i;
	var best = -1;
	var bestValue = -1.0;
	for (i = 0; i < 3; i++) {
		var compat = getModelCompat(village, modelsSettings[i]);
		if (compat >= 0 && compat > bestValue) {
			best = i;
			bestValue = compat;
		}
	}
	return String.fromCharCode(97 + best);
}

function getModelCompat(village, modelSettings) {
	if (!modelSettings.active || (/*village.wall != -1 &&*/ village.wall > modelSettings.maxWall) || village.distance > modelSettings.maxDistance) {
		return -1;
	}
	if (!modelSettings.reportColor[village.lastAttack]) {
		return -1;
	}
	if (village.maxLoot == "full" && !modelSettings.fullLoot) {
		return -1;
	}
	if (village.maxLoot == "partial" && !modelSettings.partialLoot) {
		return -1;
	}
	var farm;
	switch (modelSettings.model) {
		case "a":
			farm = village.farmA;
			break;
		case "b":
			farm = village.farmB;
			break;
		case "c":
			farm = village.farmC;
			break;
		default:
			return -1;
	}
	if (farm.isLocked) {
		return -1;
	}
	var compat = 0.0;
	var wallCompat = 0;
	if (village.wall != -1) {
		wallCompat = village.wall / modelSettings.maxWall;
		if (wallCompat) {
			compat += wallCompat;
		}
	}
	var distanceCompat = village.distance / modelSettings.maxDistance;
	if (distanceCompat) {
		compat += distanceCompat;
	}
	return compat;
}

function checkError() {
	return document.getElementsByClassName("error").length > 0;
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}