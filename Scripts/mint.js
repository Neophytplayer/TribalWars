// ==UserScript==
// @name         TW - Cunhar moedas
// @version      0.1
// @description  Script para cunhar moedas automaticamente
// @author       Pengu
// @match        https://*.tribalwars.*/game.php?village=*&screen=snob
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

    console.log("Atualizando a página em 60 segundos");
    setInterval(function() {window.location.reload();}, 1800000);
})();