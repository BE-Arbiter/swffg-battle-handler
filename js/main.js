//Inclusion des modals et includes
$(document).ready(function() {
    $("#menu").load("./html/menu.html");
    $("#combatModal").append(getHtmlFromFile("./html/modals/combatModal.html"));

    $("#combat_modal .form-control").change(() =>{
        context.combatActuel.updateFromBaseTag($("#combat_modal"));
        refreshListPersonnage();
    });

    let selectTypeCombat = $(".inputTypeCombat");
    for(let elem of context.typeCombats.list){
        var option = new Option(elem.label,elem.code);
        selectTypeCombat.append(option);
    }


    $("#playButton").click(function(){ nextInit();});
    $("#returnButton").click(function(){ previousInit();});
    /* Chargement du principal un peu particulier pour le resize */
    $("#turn-order").load("./html/turn-order.html", function(){
        $("#main-panel").load("./html/main-panel.html", function(){
            var leftPanel = $("#turn-order .panel-auto-size");
            var panelRight = $("#main-panel .panel-auto-size");
            adjustSize(leftPanel,panelRight);

            //Initialiser le combat;
            refreshListPersonnage();

            $("#personnageCourant .form-control").change(() =>{
                context.combatActuel.personnageCourant.updateFromBaseTag($("#personnageCourant"));
                refreshListPersonnage();
            });

            let selectTypePj = $(".inputType");
            var emptyOption = new Option(context.typesPj.emptyValue.label,context.typesPj.emptyValue.code);
            selectTypePj.append(emptyOption)
            for(let elem of context.typesPj.list){
                var option = new Option(elem.label,elem.code);
                selectTypePj.append(option);
            }
            $("#playButton").click(function(){ nextInit();});
            $("#returnButton").click(function(){ previousInit();});

        });
    });

});