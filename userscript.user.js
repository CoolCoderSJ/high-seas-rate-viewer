// ==UserScript==
// @name         High Seas Doubloon Rate Viewer
// @namespace    https://shuchir.dev
// @version      2024-12-05
// @description  none
// @author       Shuchir Jain
// @match        https://highseas.hackclub.com/shipyard
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hackclub.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    window.onload = () => {
        if (window.location.pathname == "/shipyard")
            setTimeout(addTooltips, 1500);
    }
    
    window.navigation.addEventListener("navigate", (event) => {
        if (event.destination.url.split("/")[3] == "shipyard")
            setTimeout(addTooltips, 1500);
    })
    
    const addTooltips = () => {
        let blessed, cursed;
    
        const myHeaders = new Headers();
        myHeaders.append("next-action", "d483dc862f183641a65ff7b18ad1b9f1b4e4d49d");
        myHeaders.append("Content-Type", "text/plain");
    
        const raw = "[]";
    
        const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
        credentials: "same-origin",
        };
    
        fetch("https://highseas.hackclub.com/wonderdome", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            console.log(result);
            result = result.split("\n")[1].substring(2);
            result = JSON.parse(result);
            console.log(result);
            blessed = result['blessed'];
            cursed = result['cursed'];
    
    
            let shipyard, ships;
    
            try {shipyard = document.querySelector("[id$=-content-shipyard]")}
            catch (e) {return;}
            try {ships = shipyard.querySelectorAll("div")}
            catch (e) {return;}
            
            ships.forEach(ship => {
                if (!ship.id) return;
    
                let content = ship.querySelector("div").querySelectorAll("div")[3];
                let hrs = content.querySelectorAll("span")[1].innerText.split(" ")[0];
                let doubloonContainer = content.querySelectorAll("span")[3];
                let doubloons = doubloonContainer.innerText;
                console.log(hrs, doubloons)
    
                if (!doubloons.includes("doubloons")) return;
                doubloons = doubloons.split(" ")[0];
    
                hrs = parseFloat(hrs);
                doubloons = parseFloat(doubloons);
    
                let blessedBase = doubloons / 1.2;
                let cursedBase = doubloons * 2;
                
                let normal = doubloons / hrs;
                let blessed = blessedBase / hrs;
                let cursed = cursedBase / hrs;
    
                console.log("here !!!!", doubloonContainer)
    
                doubloonContainer.classList.add("tooltip");
                doubloonContainer.innerHTML += `<span class="tooltiptext">Normal: ${normal.toFixed(2)}<br>Factoring Blessing: ${blessed.toFixed(2)}<br>Factoring Curse: ${cursed.toFixed(2)}</span>`;
                doubloonContainer.innerHTML += `<style>.tooltip{position:relative}.tooltip .tooltiptext{visibility:hidden;width:200px;background-color:#000;color:#fff;text-align:left;border-radius:6px;padding:7px;position:absolute;z-index:999;bottom:100%;left:50%;margin-left:-70px;display:inline-block;line-height:20px;}</style>`;
    
                doubloonContainer.addEventListener("mouseover", () => {
                    console.log("MOUSE OVER")
                    doubloonContainer.querySelector(".tooltiptext").style.visibility = "visible";
                });
                doubloonContainer.addEventListener("mouseout", () => {
                    doubloonContainer.querySelector(".tooltiptext").style.visibility = "hidden";
                });
            });
        })
        .catch((error) => console.error(error));
    }
})();