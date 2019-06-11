// ==UserScript==
// @name Farm
// @description Pengu's best auto farmer
// @author Pengu
// @include https://*screen=am_farm*
// @version 1.0
// ==/UserScript==

/* User may change these settings in order for the script to work as he wishes */
var userSettings = {
	model: "b",
	maxWall: 2,
	refreshTime: 100000, //in ms
	nextVillageTime: 180000
}

createSettingsForm();
//if (userSettings.maxWall = getCookie("maxWall")) document.farmForm.maxWall.value = userSettings.maxWall;

function createSettingsForm() {
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
		var model;
		switch (i) {
			case 0:
				model = 'a';
				break;
			case 1:
				model = 'b';
				break;
			case 2:
				model = 'c';
				break;
			default:
				break;
		}
		var settForm = document.createElement("form");
		settForm.setAttribute('name', model + 'FarmForm');
		newDiv.appendChild(settForm);

		var tableF = document.createElement("table");
		tableF.setAttribute('class', 'vis');
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
		farmIcon.setAttribute('class',"farm_icon farm_icon_" + model + " decoration");
		farmIcon.setAttribute('href',"#");
		farmIcon.setAttribute('onclick',"return false;");
		farmIconTd.appendChild(farmIcon);

		// Create settings now

		var wallTh = document.createElement("th");
		wallTh.setAttribute('style',"text-align:center");
		wallTh.setAttribute('width',"35");
		tableRow1.appendChild(wallTh);

		var wallImage = document.createElement("img");
		wallImage.setAttribute('src',"https://dspt.innogamescdn.com/asset/cf501e93/graphic/buildings/wall.png");
		wallImage.setAttribute('class',"");
		wallTh.appendChild(wallImage);


		// Create a button to save settings for each farm model

		var saveIconTd = document.createElement("td");
		saveIconTd.setAttribute('rowspan', "2");
		saveIconTd.setAttribute('align', "center");
		saveIconTd.setAttribute('width', "15%");
		tableRow1.appendChild(saveIconTd);

		var saveIconDiv = document.createElement("div");
		saveIconDiv.setAttribute('class',"vis_item");
		saveIconTd.appendChild(saveIconDiv);

		var saveIcon = document.createElement("input");
		saveIcon.setAttribute('class',"button");
		//saveIcon.setAttribute('type',"submit");
		saveIcon.setAttribute('value',"Guardar");
		saveIconDiv.appendChild(saveIcon);

		/*<td rowspan="2" width="15%" align="center">
			<div class="vis_item">
				<input class="btn" type="submit" value="Guardar">
			</div>
		</td>*/

		var tableRow2 = document.createElement("tr");
		tableF.appendChild(tableRow2);

		/*var inp = document.createElement("input");
		inp.setAttribute('type', "text");
		inp.setAttribute('name', "maxWall");
		tableBody.appendChild(i);

		var s = document.createElement("input");
		s.setAttribute('type', "submit");
		s.setAttribute('value', "Submit");
		tableBody.appendChild(s);*/
	}
}

function setCookie(name, value) {
	document.cookie = name + "=" + escape(value) + "; path=/";
}

function getCookie(name) {
	var re = new RegExp(name + "=([^;]+)");
	var value = re.exec(document.cookie);
	return (value != null) ? unescape(value[1]) : null;
}