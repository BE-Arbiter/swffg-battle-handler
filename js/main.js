//Inclusion des modals et includes
$(document).ready(function () {
    $("#menu").load("./html/menu.html");
    $("#combatModal").append(getHtmlFromFile("./html/modals/combatModal.html"));
    $("#turn-order").append(getHtmlFromFile("./html/turn-order.html"));
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
    // Remplir les selects
    let selectTypeCombat = $(".inputTypeCombat");
    for (let elem of context.typeCombats.list) {
        var option = new Option(elem.label, elem.code);
        selectTypeCombat.append(option);
    }

    let selectTypePj = $(".inputType");
    var emptyOption = new Option(context.typesPj.emptyValue.label, context.typesPj.emptyValue.code);
    selectTypePj.append(emptyOption)
    for (let elem of context.typesPj.list) {
        var option = new Option(elem.label, elem.code);
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

    //Addapter la taille
    var leftPanel = $("#turn-order .panel-auto-size");
    var panelRight = $("#main-panel .panel-auto-size");
    adjustSize(leftPanel, panelRight);




});