// ==UserScript==
// @name         Mass Mint
// @version      0.2
// @description  Script to mass mint coins
// @author       Pengu
// @include      https://*.tribalwars.*/game.php?village=*&screen=snob&mode=coin*
// @grant        none
// ==/UserScript==

(function() {
    function makeMaximumAmount(){
        var maximumAmount = document.getElementById("coin_mint_fill_max").text.match(/\(([^)]+)\)/)[1];
        if(document.getElementById("coin_mint_count").value != maximumAmount){
            document.getElementById("coin_mint_count").value = maximumAmount;
        }
        document.getElementsByClassName("btn btn-default")[0].click();
    }

    if(document.getElementById("coin_mint_count") !== null){
        makeMaximumAmount();
    }

    setInterval(function() {window.location.reload();}, 1800000);
})();