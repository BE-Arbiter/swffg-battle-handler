function refreshListInitiatives() {
    context.combatActuel.initiatives = [];
    context.combatActuel.currentInitiativeIndex = null;
    context.combatActuel.lastInit = null;
    let typeCombat = context.combatActuel.typeCombat;
    for (let personnage of context.combatActuel.personnageList) {
        if (typeof (personnage.initiative) !== "number") {
            continue;
        }
        let tmpInitiative = new Initiative();
        tmpInitiative.value = personnage.initiative;
        personnage.hasPlayed = false;
        switch (typeCombat) {
            case "TYPE":
                tmpInitiative.label = personnage.type;
                tmpInitiative.group = personnage.type;
                break;
            case "GROUPE":
                tmpInitiative.label = personnage.groupe;
                tmpInitiative.group = personnage.groupe;
                break;
            case "NOM":
            default:
                tmpInitiative.label = personnage.nom;
                tmpInitiative.group = personnage.id;
        }
        context.combatActuel.initiatives.push(tmpInitiative);
    }
    /* Si il y a des initiatives on les tries et on initialises le combat */
    if (context.combatActuel.initiatives.length > 0) {
        context.combatActuel.initiatives.sort(function (a, b) {
            if (a.value === b.value) {
                if (a.label > b.label) {
                    return -1;
                }
                if (a.label < b.label) {
                    return 1;
                }
                return 0;
            }
            return b.value - a.value;
        });
        context.combatActuel.currentInitiativeIndex = 0;
        context.combatActuel.initiatives[context.combatActuel.initiatives.length - 1].last = true;
    }
    applyInitiativesToTag($("#listInitiatives"));
    checkButtons();
}

function applyInitiativesToTag(baseTag) {
    if (!baseTag || !baseTag.length) {
        return;
    }
    let initList = context.combatActuel.initiatives;
    baseTag.empty();
    if (!initList || initList.length === 0) {
        baseTag.append("Aucune Initiative");
        return;
    }
    for (let i = context.combatActuel.currentInitiativeIndex ; i < context.combatActuel.initiatives.length ; i++) {
        let initiative = context.combatActuel.initiatives[i];
        /* Créer le tag */
        let template = getHtmlFromFile("./html/templates/templateInitiative.html");
        if(context.combatActuel.typeCombat === "NOM"){
            template = getHtmlFromFile("./html/templates/templateInitiativeNominative.html");
            template = template.split("PLACEHOLDER_ONCLICK").join("selectPersonnage("+initiative.group+");refreshListPersonnage()");
        }
        else{
            template = template.split("PLACEHOLDER_ONCLICK").join("");
        }
        template = template.split("PLACEHOLDER_VALEUR").join(initiative.value);
        template = template.split("PLACEHOLDER_LABEL").join(initiative.label);
        baseTag.append(template);
    }
    baseTag.append("<div class='row'><div class='col-md-12'><hr></div></div>");
    for(let i = 0; i < context.combatActuel.currentInitiativeIndex;i++){
        let initiative = context.combatActuel.initiatives[i];
        /* Créer le tag */
        let template = getHtmlFromFile("./html/templates/templateInitiative.html");
        if(context.combatActuel.typeCombat === "NOM"){
            template = getHtmlFromFile("./html/templates/templateInitiativeNominative.html");
            template = template.split("PLACEHOLDER_ONCLICK").join("selectPersonnage("+initiative.group+");refreshListPersonnage()");
        }
        else{
            template = template.split("PLACEHOLDER_ONCLICK").join("");
        }
        template = template.split("PLACEHOLDER_VALEUR").join(initiative.value);
        template = template.split("PLACEHOLDER_LABEL").join(initiative.label);
        baseTag.append(template);
    }
}

function checkButtons() {
    let playButton = $("#playButton");
    let showPlay = false;
    let returnButton = $("#returnButton");
    if (context.combatActuel.initiatives && context.combatActuel.initiatives.length > 0) {
        showPlay = canPlay();
    }
    if( context.combatActuel.lastInit){
        returnButton.removeClass("disabled");
    }
    else{
        returnButton.addClass("disabled");
    }

    if (showPlay) {
        playButton.removeClass("disabled");
    } else {
        playButton.addClass("disabled");
    }
}

function canPlay(){
    let group = context.combatActuel.initiatives[context.combatActuel.currentInitiativeIndex].group;
    switch (context.combatActuel.typeCombat) {
        case "TYPE":
            return (context.combatActuel.personnageCourant.type === group) && !context.combatActuel.personnageCourant.hasPlayed;
            break;
        case "GROUPE":
            return (context.combatActuel.personnageCourant.groupe === group) && !context.combatActuel.personnageCourant.hasPlayed;
            break;
        case "NOM":
        default:
            return (context.combatActuel.personnageCourant.id === group) && !context.combatActuel.personnageCourant.hasPlayed;
    }
}
function previousInit(){
    if(!context.combatActuel.initiatives || context.combatActuel.initiatives.length === 0){
        return;
    }
    if(!context.combatActuel.lastInit){
        return;
    }
    context.combatActuel.currentInitiativeIndex--;
    context.combatActuel.lastInit.hasPlayed = false;
    context.combatActuel.lastInit = null;
    if(context.combatActuel.typeCombat === "NOM"){
        let id = context.combatActuel.initiatives[context.combatActuel.currentInitiativeIndex].group;
        selectPersonnage(id);
        $('#personnageSelect').val(id);
    }
    applyInitiativesToTag($("#listInitiatives"));
    checkButtons();
}

function nextInit() {
    if(!context.combatActuel.initiatives || context.combatActuel.initiatives.length === 0){
        return;
    }
    if(!canPlay()){
        return;
    }
    if(context.combatActuel.currentInitiativeIndex === (context.combatActuel.initiatives.length-1)){
        context.combatActuel.currentInitiativeIndex = 0;
        context.combatActuel.lastInit = null;
        for(let personnage of context.combatActuel.personnageList){
            personnage.hasPlayed = false;
            let toDeleteEffet = [];
            for(let i = 0; i <  personnage.effets.length;i++){
                let effet = personnage.effets[i];
                if(effet.dureeTotale > 0 && effet.dureeRestante > 1){
                    effet.dureeRestante--;
                }
                else if( effet.dureeTotale > 0 && effet.dureeRestante === 1){
                    toDeleteEffet.push(i);
                }
            }
            for(let i of toDeleteEffet){
                deleteEffet(i);
            }
        }
    }
    else {
        context.combatActuel.currentInitiativeIndex++;
        context.combatActuel.personnageCourant.hasPlayed = true;
        context.combatActuel.lastInit = context.combatActuel.personnageCourant;
    }
    if(context.combatActuel.typeCombat === "NOM"){
        let id = context.combatActuel.initiatives[context.combatActuel.currentInitiativeIndex].group;
        selectPersonnage(id);
        $('#personnageSelect').val(id);
    }
    applyInitiativesToTag($("#listInitiatives"));
    checkButtons();
}