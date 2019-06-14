// ==UserScript==
// @name Farm
// @description Pengu's best auto farmer
// @author Pengu
// @include https://*screen=am_farm*
// @version 1.0
// ==/UserScript==

/* User may change these settings in order for the script to work as he wishes */
var farmSettings = {
	refreshTime: 180000, //in ms (180000 = 3 mins)
	nextVillageTime: 100000,
	switchVillages: true,
	timeBetweenAttacks: 300 //should be higher than the minimum interval between attacks that the server allows
}

run();

function run() {
	var modelsSettings = loadSettings();
	createSettingsForm(modelsSettings);
	startFarming(farmSettings, modelsSettings);
}

function createModelsSettings() {
	var modelsSettings = [{}, {}, {}];
	var i = 0;
	for (i = 0; i < 3; i++) {
		modelsSettings[i].model = String.fromCharCode(97 + i);
		modelsSettings[i].maxWall = 0;
		modelsSettings[i].maxDistance = 0;
		modelsSettings[i].fullResources = true;
		modelsSettings[i].emptyResources = true;
		modelsSettings[i].active = false;
	}
	return modelsSettings;
}

function loadSettings() {
	var modelsSettings = getModelsSettings();
	if (modelsSettings == null) {
		console.log("Creating models settings!");
		modelsSettings = createModelsSettings();
	}
	saveModelsSettings(modelsSettings);
	return modelsSettings;
}

function saveModelsSettings(modelsSettings) {
	localStorage.setItem('modelsSettings', JSON.stringify(modelsSettings));
}

function saveModelSettings(model, modelsSettings) {
	var form = document.getElementsByName(model + "FarmForm")[0];
	var inputsRow = form.getElementsByTagName('tr')[1];
	var inputs = inputsRow.getElementsByTagName("td");
	var modelSettings = modelsSettings[model.charCodeAt(0) - 97];
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
	modelSettings.fullResources = inputsRow.querySelector('input[name="fullResources"]').checked;
	modelSettings.emptyResources = inputsRow.querySelector('input[name="emptyResources"]').checked;
	modelSettings.active = inputsRow.querySelector('input[name="modelOn"]').checked;
	alert("Settings for model " + model.toUpperCase() + " saved successfully!")
	saveModelsSettings(modelsSettings);
}

function getModelsSettings() {
	var settings = JSON.parse(localStorage.getItem('modelsSettings'));
	return settings;
}

function createSettingsForm(modelsSettings) {
	var assTable = document.getElementById('content_value'); //Get farm assistant main table
	var assTitle = assTable.getElementsByTagName('h3')[0];

	var newDiv = document.createElement("div");
	newDiv.setAttribute('class', 'vis');
	assTitle.parentNode.insertBefore(newDiv, assTitle.nextSibling);

	var fTitle = document.createElement("h4");
	fTitle.textContent = "AutoFarmer Settings";
	newDiv.appendChild(fTitle);

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
		farmIcon.setAttribute('href', "#");
		farmIcon.setAttribute('onclick', "return false;");
		farmIconTd.appendChild(farmIcon);

		// Create settings now

		var wallTh = document.createElement("th");
		wallTh.setAttribute('style', "text-align:center");
		wallTh.setAttribute('width', "35");
		tableRow1.appendChild(wallTh);

		var wallImage = document.createElement("img");
		wallImage.setAttribute('src', "https://dspt.innogamescdn.com/asset/cf501e93/graphic/buildings/wall.png");
		wallImage.setAttribute('class', "");
		wallTh.appendChild(wallImage);

		var distTh = document.createElement("th");
		distTh.setAttribute('style', "text-align:center");
		distTh.setAttribute('width', "35");
		tableRow1.appendChild(distTh);

		var distImage = document.createElement("img");
		distImage.setAttribute('src', "https://dspt.innogamescdn.com/asset/cf501e93/graphic/rechts.png");
		distImage.setAttribute('class', "");
		distTh.appendChild(distImage);

		var fullResTh = document.createElement("th");
		fullResTh.setAttribute('style', "text-align:center");
		fullResTh.setAttribute('width', "35");
		tableRow1.appendChild(fullResTh);

		var fullResImage = document.createElement("img");
		fullResImage.setAttribute('src', "https://dspt.innogamescdn.com/asset/cf501e93/graphic/max_loot/1.png");
		fullResImage.setAttribute('class', "");
		fullResTh.appendChild(fullResImage);

		var emptyResTh = document.createElement("th");
		emptyResTh.setAttribute('style', "text-align:center");
		emptyResTh.setAttribute('width', "35");
		tableRow1.appendChild(emptyResTh);

		var emptyResImage = document.createElement("img");
		emptyResImage.setAttribute('src', "https://dspt.innogamescdn.com/asset/cf501e93/graphic/max_loot/0.png");
		emptyResImage.setAttribute('class', "");
		emptyResTh.appendChild(emptyResImage);

		var modelOnTh = document.createElement("th");
		modelOnTh.setAttribute('style', "text-align:center");
		modelOnTh.setAttribute('width', "35");
		tableRow1.appendChild(modelOnTh);

		var modelOnImage = document.createElement("img");
		modelOnImage.setAttribute('src', "https://dspt.innogamescdn.com/asset/cf501e93/graphic/dots/green.png");
		modelOnImage.setAttribute('class', "");
		modelOnTh.appendChild(modelOnImage);

		// Create a button to save settings for each farm model

		var saveIconTd = document.createElement("td");
		saveIconTd.setAttribute('rowspan', "2");
		saveIconTd.setAttribute('width', "15%");
		saveIconTd.setAttribute('align', "center");
		tableRow1.appendChild(saveIconTd);

		var saveIconDiv = document.createElement("div");
		saveIconDiv.setAttribute('class', "vis_item");
		saveIconTd.appendChild(saveIconDiv);

		var saveIcon = document.createElement("input");
		saveIcon.setAttribute('name', model);
		saveIcon.setAttribute('type', "button");
		saveIcon.setAttribute('class', "btn");
		saveIcon.setAttribute('value', "Guardar");
		saveIcon.onclick = function () {
			saveModelSettings(this.name, modelsSettings);
		};
		saveIconDiv.appendChild(saveIcon);

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
		fullResInput.setAttribute('name', "fullResources");
		fullResInput.setAttribute('size', "3");
		fullResInput.checked = modelSettings.fullResources;
		fullResTd.appendChild(fullResInput);

		var emptyResTd = document.createElement("td");
		emptyResTd.setAttribute('align', "center");
		tableRow2.appendChild(emptyResTd);

		var emptyResInput = document.createElement("input");
		emptyResInput.setAttribute('type', "checkbox");
		emptyResInput.setAttribute('name', "emptyResources");
		emptyResInput.setAttribute('size', "3");
		emptyResInput.checked = modelSettings.emptyResources;
		emptyResTd.appendChild(emptyResInput);

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
}

function getVillages() {
	var villages = [];
	var plunderTable = document.getElementById('plunder_list');
	var plunderTableLines = plunderTable.childNodes[1].getElementsByTagName('tr');
	var i;
	var j = 0;
	for (i = 2; i < plunderTableLines.length; i++) {
		var villageId = plunderTableLines[i].id;
		var plunderLine = plunderTableLines[i].getElementsByTagName('td');
		var villageWall = plunderLine[6].textContent;
		var villageDist = plunderLine[7].textContent;
		villages[j] = {
			id: villageId,
			wall: parseInt(villageWall),
			distance: parseFloat(villageDist),
			farmA: {
				element: plunderLine[8].firstElementChild,
				isLocked: plunderLine[8].firstElementChild.classList.contains("start_locked")
			},
			farmB: {
				element: plunderLine[9].firstElementChild,
				isLocked: plunderLine[9].firstElementChild.classList.contains("start_locked")
			},
			farmC: {
				element: plunderLine[10].firstElementChild,
				isLocked: plunderLine[10].firstElementChild.classList.contains("start_locked")
			},
			line: plunderTableLines[i]
		}
		j++;
	}
	return villages;
}

async function startFarming(settings, modelsSettings) {
	var f;
	if (settings.switchVillages) {
		f = function () {
			document.getElementById("village_switch_right").getElementsByTagName("span")[0].click();
		};
	} else {
		f = function () {
			window.location.reload();
		};
	}
	setInterval(f, settings.refreshTime);
	do {
		var villages = getVillages();
		await farmVillages(villages, settings, modelsSettings);
	} while (villages.length > 0);
}

async function farmVillages(villages, settings, modelsSettings) {
	var i;
	for (i = 0; i < villages.length; i++) {
		var modelChosen = chooseModel(villages[i], modelsSettings);
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
		} else {
			//villages[i].line.remove();
		}
		await sleep(settings.timeBetweenAttacks);
	}
}

function chooseModel(village, modelsSettings) {
	var i;
	var best = -1;
	var bestValue = -1.0;
	for (i = 0; i < 3; i++) {
		var compat = getModelCompat(village, modelsSettings[i]);
		if (compat > bestValue) {
			best = i;
			bestValue = compat;
		}
	}
	return String.fromCharCode(97 + best);
}

function getModelCompat(village, modelSettings) {
	if (!modelSettings.active || village.wall > modelSettings.maxWall || village.distance > modelSettings.maxDistance) {
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
	compat += village.wall / modelSettings.maxWall;
	compat += village.distance / modelSettings.maxDistance;
	return compat;
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}