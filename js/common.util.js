//Compteur pour générer des nombres uniques
let counter = 0;

//Recalcul auto
function refreshSize() {
    var leftPanel = $("#turn-order .panel-auto-size");
    var panelRight = $("#main-panel .panel-auto-size");

    adjustSize(leftPanel, panelRight);
}

$(window).resize(function (){refreshSize();});

function getNumber(value) {
    let number = Number(value);
    if (number !== number) {
        return null;
    }
    return number;
}

//Gestion des hauteurs de colonnes pour un joli layout
function handleSize(){
    if(!context.heightObserver){
        return;
    }
    context.heightObserver.disconnect();
    var leftPanel = $("#left-panel.panel-auto-size");
    var panelRight = $("#main-panel .panel-auto-size");
    adjustSize(leftPanel, panelRight);
    context.heightObserver.observe(leftPanel[0],{attributes:true});
    context.heightObserver.observe(panelRight[0],{attributes:true});
}

function adjustSize(panelLeft, panelRight) {
    resetSize(panelLeft, panelRight);
    if ($(window).width() > 991) {
        var height_panelLeft = panelLeft.height();
        var height_panelRight = panelRight.height();
        var max_height = (height_panelLeft > height_panelRight) ? height_panelLeft : height_panelRight;
        panelLeft.height(max_height);
        panelRight.height(max_height);
    }
}

function resetSize(panelLeft, panelRight) {
    panelLeft.height("auto");
    panelRight.height("auto");
}

//Téléchargement
function download(blob, filename) {
    let a = document.createElement("a");
    document.body.appendChild(a);
    a.setAttribute('style', 'display:none;');
    let url = window.URL.createObjectURL(blob);
    a.download = filename;
    a.href = url;
    a.click();
}

//Récupération d'un fichier Externe
function getHtmlFromFile(filename) {
    var html;
    $.ajax({
        dataType: "html",
        crossDomain: true,
        async: false,
        method: 'get',
        url: filename,
        success: function (data) {
            html = data;
        }
    });
    return html;
}

//Synchronise
function synchroniseContext(){
    if(typeof(Storage) === "undefined"){
        modal.warn("Gestion du LocalStorage non supportée");
        return;
    }
    window.localStorage.setItem("FFG_BATTLE_HANDLER_CONTEXT",JSON.stringify(context));
}

function loadContextFromStorage(){
    let oldContext = window.localStorage.getItem("FFG_BATTLE_HANDLER_CONTEXT");
    oldContext = JSON.parse(oldContext);
    if(!oldContext || !oldContext.combats || !oldContext.combats.length){
        console.warn("Attention, l'ancien contexte est \"vide\"");
        return;
    }
    //Nettoyer les combats
    context.combats = [];
    //Faire "revivre" tous les combats
    for(let combatData of oldContext.combats){
        let savedId = combatData.id;
        let combat = reviveCombatFromData(combatData);
        if(savedId === oldContext.combatActuel.id){
            context.combatActuel = combat;
        }
        context.combats.push(combat);
    }
}

//For switching collapsible element()
function collapser(source){
    let myJQueryEvent = source;
    let selector = myJQueryEvent.attr("data-target");
    while(!selector){
        myJQueryEvent = myJQueryEvent.parent();
        if(myJQueryEvent.is('body')){
            return;
        }
        selector = myJQueryEvent.attr("data-target");
    }
    const element = $(selector);
    if(element.hasClass("in")){
        element.removeClass("in");
    }
    else{
        element.addClass("in");
    }
    handleSize();
}
