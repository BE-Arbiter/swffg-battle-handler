//Inclusion des modals et includes
$(document).ready(function() {
    $("#menu").load("./html/menu.html");
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

        });
    });

});