function refreshListInitiatives(){
    context.combatActuel.initiatives = [];
    let typeCombat = context.combatActuel.typeCombat;
    for(let personnage of context.combatActuel.personnageList){
        if(typeof(personnage.initiative) !== "number"){
            continue;
        }
        let tmpInitiative = new Initiative();
        tmpInitiative.value = personnage.initiative;
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
    context.combatActuel.initiatives.sort(function (a, b) {
        if(a.value === b.value){
            if(a.label > b.label){
                return -1;
            }
            if(a.label < b.label){
                return 1;
            }
            return 0;
        }
        return b.value - a.value;
    });
    context.combatActuel.initiatives[context.combatActuel.initiatives.length-1].last = true;
    applyInitiativesToTag($("#listInitiatives"));
}

function applyInitiativesToTag(baseTag){
    if(!baseTag || !baseTag.length){
        return;
    }
    let initList = context.combatActuel.initiatives;
    baseTag.empty();
    if(!initList || initList.length === 0){
        baseTag.append("Aucune Initiative");
        return;
    }
    for(let initiative of context.combatActuel.initiatives){
        /* Créer le tag */
        let template = getHtmlFromFile("./html/templates/templateInitiative.html");
        template = template.split("PLACEHOLDER_VALEUR").join(initiative.value);
        template = template.split("PLACEHOLDER_LABEL").join(initiative.label);
        baseTag.append(template);
    }
}