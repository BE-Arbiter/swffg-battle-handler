//Inclusion des modals et includes
$(document).ready(function () {
    $("#menu").load("./html/menu.html");
    $("#combatModal").append(getHtmlFromFile("./html/modals/combatModal.html"));
    let leftPanelDiv = $("#left-panel");
    leftPanelDiv.append(getHtmlFromFile("./html/character-list.html"));
    leftPanelDiv.append(getHtmlFromFile("./html/turn-order.html"));
    $("#main-panel").append(getHtmlFromFile("./html/main-panel.html"));
    // Placer les events-listeners
    $("#combat_modal .update-combat-control").change(()=>{
        context.combatActuel.updateFromBaseTag($("#combat_modal"));
        refreshListCombat();
        refreshListPersonnage();
    });
    $("#personnageCourant .form-control").change(()=>{
        context.combatActuel.personnageCourant.updateFromBaseTag($("#personnageCourant"));
        refreshListPersonnage();
    });

    $("#playButton").click(function () {
        nextInit();
    });
    $("#returnButton").click(function () {
        previousInit();
    });
    $("#forwardButton").click(function () {
        nextInit(true);
    });
    $("#renderInactiveButton").click(function () {
        desactivateCurrentPersonnage();
    });
    $(".collapser").click(function(event){
        collapser($(event.target));
    });
    // Remplir les selects
    let selectTypeCombat = $(".inputTypeCombat");
    for (let elem of context.typeCombats.list) {
        const option = new Option(elem.label, elem.code);
        selectTypeCombat.append(option);
    }

    let selectTypePj = $(".inputType");
    var emptyOption = new Option(context.typesPj.emptyValue.label, context.typesPj.emptyValue.code);
    selectTypePj.append(emptyOption);
    for (let elem of context.typesPj.list) {
        const option = new Option(elem.label, elem.code);
        selectTypePj.append(option);
    }

    //Eventuellement revive le "context"
    loadContextFromStorage();

    //Initialiser les combats
    context.combatActuel.updateToBaseTag($("#combat_modal"));
    refreshListCombat();
    if(context.combatActuel != null && context.combatActuel.personnageCourant != null){
        selectPersonnage(context.combatActuel.personnageCourant.id);
    }
    //Initialiser les personnages;
    refreshListPersonnage();
    refreshInactiveCharacterList();

    //Ajouter l'auto resize des doms
    context.heightObserver = new MutationObserver( (mutations) =>{
        handleSize();
    });
    handleSize();
});
