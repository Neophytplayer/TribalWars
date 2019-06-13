// ==UserScript==
// @name Farm
// @description Pengu's best auto farmer
// @author Pengu
// @include https://*screen=am_farm*
// @version 1.0
// ==/UserScript==

/* User may change these settings in order for the script to work as he wishes */
var farmSettings = {
	refreshTime: 1000000, //in ms
	nextVillageTime: 100000,
	timeBetweenAttacks: 300
}

run();

//if (userSettings.maxWall = getCookie("maxWall")) document.farmForm.maxWall.value = userSettings.maxWall;

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
		modelsSettings[i].fullResources = false;
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
		saveIcon.setAttribute('class', "btn");
		//saveIcon.setAttribute('type',"submit");
		saveIcon.setAttribute('value', "Guardar");
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
		emptyResInput.setAttribute('name', "fullResources");
		emptyResInput.setAttribute('size', "3");
		emptyResInput.checked = modelSettings.emptyResources;
		emptyResTd.appendChild(emptyResInput);

		var modelOnTd = document.createElement("td");
		modelOnTd.setAttribute('align', "center");
		tableRow2.appendChild(modelOnTd);

		var modelOnInput = document.createElement("input");
		modelOnInput.setAttribute('type', "checkbox");
		modelOnInput.setAttribute('name', "fullResources");
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
			farmA: plunderLine[8].firstElementChild,
			farmB: plunderLine[9].firstElementChild,
			farmC: plunderLine[10].firstElementChild
		}
		j++;
	}
	console.log(villages);
	return villages;
}

async function startFarming(settings, modelsSettings) {
	var villages = getVillages();
	var i;
	for (i = 0; i < villages.length; i++) {
		var modelChosen = "b";
		var farm;
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
				break;
		}
		if (!farm.classList.contains("start_locked")) {
			farm.click();
		}
		await sleep(farmSettings.timeBetweenAttacks);
	}
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}