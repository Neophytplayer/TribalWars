// ==UserScript==
// @name Farm Minuncioso
// @description
// @author Pingu
// @include https://*mode=scavenge*
// @version 1.0
// ==/UserScript==

var units = { spear: 11, sword: 0, axe: 0, archer: 0, light: 0, marcher: 0, heavy: 0, knight: 0 };

var refresh = true; /*Set true or false if you want to refesh the page periodically or not*/
var refreshTime = 100000; /* Refresh time in ms*/