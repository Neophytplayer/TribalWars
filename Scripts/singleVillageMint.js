// ==UserScript==
// @name         Single Village Mint
// @version      0.1
// @description  Script to mint coins in a single village
// @author       Pengu
// @include      https://*.tribalwars.*/game.php?village=*&screen=snob&mode=train*
// @include      https://*.tribalwars.*/game.php?village=*&screen=snob
// @grant        none
// ==/UserScript==

(function() {

    var clickMaxCoins = document.getElementById("coin_mint_fill_max");

    if(clickMaxCoins !== null){
        clickMaxCoins.click();
        document.getElementsByClassName("btn btn-default")[0].click();
    }

    setInterval(function() {window.location.reload();}, 1800000);
})();