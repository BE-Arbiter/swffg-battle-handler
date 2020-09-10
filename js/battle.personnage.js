function selectPersonnage(id) {
    id = Number(id);
    for (let tmpPersonnage of context.combatActuel.personnageList) {
        if (tmpPersonnage.id === id) {
            context.combatActuel.personnageCourant = tmpPersonnage;
            context.combatActuel.personnageCourant.updateToBaseTag($("#personnageCourant"));
            checkButtons();
            return;
        }
    }
}

function refreshListPersonnage() {
    //Nettoyer le select
    let select = $("#personnageSelect");
    let personnageCourrantDOM = $("#personnageCourant");
    let personnagePlaceHolder = $("#aucunPersonnagePlaceholder");
    let inactiveButton = $("#renderInactiveButton");
    select.empty();
    //Parcourir les personnages
    let hasPersonnageCourrant = false;
    for (let personnageTmp of context.combatActuel.personnageList) {
        let nomToAdd = "Nouveau Personnage";
        if (personnageTmp.nom) {
            nomToAdd = personnageTmp.nom;
        }
        select.append('<option value="' + personnageTmp.id + '">' + nomToAdd + '</option>');
        if (context.combatActuel.personnageCourant && context.combatActuel.personnageCourant.id === personnageTmp.id) {
            hasPersonnageCourrant = true;
        }
    }
    //Sélectionner le personnage courrant si il existe encore;
    if (hasPersonnageCourrant) {
        select.val(context.combatActuel.personnageCourant.id);
        personnageCourrantDOM.removeClass("hidden");
        personnagePlaceHolder.addClass("hidden");
        inactiveButton.removeClass("disabled");
    } else if (context.combatActuel.personnageList.length > 0) {
        context.combatActuel.personnageCourant = context.combatActuel.personnageList[0];
        context.combatActuel.personnageCourant.updateToBaseTag(personnageCourrantDOM);
        personnageCourrantDOM.removeClass("hidden");
        personnagePlaceHolder.addClass("hidden");
        inactiveButton.removeClass("disabled");
    } else {
        context.combatActuel.personnageCourant = null;
        personnageCourrantDOM.addClass("hidden");
        personnagePlaceHolder.removeClass("hidden");
        inactiveButton.addClass("disabled");
    }
    context.combatActuel.updateToBaseTag($("#combat_modal"));
    checkButtons();
}

function duplicatePersonnage() {
    if (context.combatActuel && context.combatActuel.personnageCourant) {
        addPersonnageToList(revivePersonnageFromData(context.combatActuel.personnageCourant));
    }
}

function addPersonnageToList(toAdd) {
    context.combatActuel.personnageCourant = toAdd;
    context.combatActuel.personnageList.push(context.combatActuel.personnageCourant);
    refreshListPersonnage();
    selectPersonnage(toAdd.id);
    $("#personnageCourant").removeClass("hidden");
    $("#aucunPersonnagePlaceholder").addClass("hidden");
}

function loadPersonnage(evenement) {
    if (evenement.files && evenement.files[0]) {
        var myFile = evenement.files[0];
        var reader = new FileReader();

        reader.addEventListener('load', function () {
            var newPersonnageData = JSON.parse(reader.result);
            if (newPersonnageData.clazz !== "PERSONNAGE") {
                console.error("Le type de fichier chargé n'est pas de type PERSONNAGE, mais de type " + newPersonnageData.clazz);
            }
            addPersonnageToList(revivePersonnageFromData(newPersonnageData));
        });
        reader.readAsText(myFile);
    }
}

function revivePersonnageFromData(data) {
    var newPersonnage = new Personnage();
    for (let prop in data) {
        //L'id est déjà auto-générée dans le constructeur.
        if (prop === "id") {
            continue;
        }
        newPersonnage[prop] = data[prop];
    }
    return newPersonnage;
}

function deletePersonnage() {
    if (!context.combatActuel.personnageCourant) {
        return;
    }
    //Supprimer le perso de la liste des persos.
    for (let i = 0; i < context.combatActuel.personnageList.length; i++) {
        if (context.combatActuel.personnageList[i].id === context.combatActuel.personnageCourant.id) {
            context.combatActuel.personnageList.splice(i, 1);
            break;
        }
    }
    //Supprimer son initiative de la liste des initiatives
    for (let i = 0; i < context.combatActuel.initiatives.length; i++) {
        if (context.combatActuel.initiatives[i].from === context.combatActuel.personnageCourant.id) {
            context.combatActuel.initiatives.splice(i, 1);
            break;
        }
    }
    context.combatActuel.personnageCourant = null;
    refreshListPersonnage();
    refreshListInitiatives();
}
function deletePersonnageInactif(idString) {
	//Supprimer le perso de la liste des persos.
    let id = Number(idString);
	for (let i = 0; i < context.combatActuel.personnageInactifs.length; i++) {
		if (context.combatActuel.personnageInactifs[i].id === id) {
			context.combatActuel.personnageInactifs.splice(i, 1);
			break;
		}
	}
    refreshInactiveCharacterList();
}

//Sauvegarde
function savePersonnage() {
    var tmpPersonnage = context.combatActuel.personnageCourant;
    if (tmpPersonnage.nom == null || tmpPersonnage.nom === "") {
        return;
    }
    var text = JSON.stringify(tmpPersonnage);
    var fileName = tmpPersonnage.nom;
    fileName += ".json";
    var blob = new Blob([text], {type: "application/json"});
    download(blob, fileName);
}

//Activer Un personnage
function activateOnePersonnage(idString) {
    let id = Number(idString);
    for (let i = 0; i < context.combatActuel.personnageInactifs.length; i++) {
        let personnage = context.combatActuel.personnageInactifs[i];
        if (personnage.id === id) {
            context.combatActuel.personnageInactifs.splice(i, 1);
            context.combatActuel.personnageList.push(personnage);
            refreshListPersonnage();
			refreshInactiveCharacterList();
            context.combatActuel.updateToBaseTag($("#combat_modal"))
        }
    }
}
function activatePersonnage() {
    let idList = $("#combat_modal .inputInactifsCombat").val();
    for (let idString of idList) {
        let id = Number(idString);
        for (let i = 0; i < context.combatActuel.personnageInactifs.length; i++) {
            let personnage = context.combatActuel.personnageInactifs[i];
            if (personnage.id === id) {
                context.combatActuel.personnageInactifs.splice(i, 1);
                context.combatActuel.personnageList.push(personnage);
                refreshListPersonnage();
				refreshInactiveCharacterList();
                context.combatActuel.updateToBaseTag($("#combat_modal"))
            }
        }
    }
}

//Créer une copie d'un personnage
function copyInactivePersonnage(idString) {
	let id = Number(idString);
	for (let i = 0; i < context.combatActuel.personnageInactifs.length; i++) {
		let personnage = context.combatActuel.personnageInactifs[i];
		if (personnage.id === id) {
			let copy = revivePersonnageFromData(personnage);
			context.combatActuel.personnageList.push(copy);
			refreshListPersonnage();
			refreshInactiveCharacterList();
			context.combatActuel.updateToBaseTag($("#combat_modal"))
		}
	}

}

//Desactiver un personnage
function desactivateCurrentPersonnage() {
    if(!context.combatActuel.personnageCourant){
        return;
    }
    let id = Number(context.combatActuel.personnageCourant.id);
    for (let i = 0; i < context.combatActuel.personnageList.length; i++) {
        let personnage = context.combatActuel.personnageList[i];
        if (personnage.id === id) {
            context.combatActuel.personnageList.splice(i, 1);
            context.combatActuel.personnageInactifs.push(personnage);
            context.combatActuel.personnageCourant = null;
            refreshListPersonnage();
            refreshListInitiatives();
			refreshInactiveCharacterList();
            context.combatActuel.updateToBaseTag($("#combat_modal"))
        }
    }
}

function desactivatePersonnage() {
    let idList = $("#combat_modal .inputActifsCombat").val();
    for (let idString of idList) {
        let id = Number(idString);
        for (let i = 0; i < context.combatActuel.personnageList.length; i++) {
            let personnage = context.combatActuel.personnageList[i];
            if (personnage.id === id) {
                context.combatActuel.personnageList.splice(i, 1);
                context.combatActuel.personnageInactifs.push(personnage);
                refreshListPersonnage();
                refreshListInitiatives();
				refreshInactiveCharacterList();
                context.combatActuel.updateToBaseTag($("#combat_modal"))
            }
        }
    }
}

//Lié a la liste des personnages innactifs
function refreshInactiveCharacterList(){
	let i = 0;
	let body = $("#character-list-body");
	body.find(".inactive_character_placeholder").removeClass("hidden");
	body.find(".inactive_character").remove();
	for(let personnage of context.combatActuel.personnageInactifs){
		let template = getHtmlFromFile("./html/templates/templateCharacterInactif.html");
		template = template.split("CHARACTER_NAME").join(personnage.nom);
		template = template.split("CHARACTER_ID").join(personnage.id);
		body.find(".inactive_character_placeholder").addClass("hidden");
		body.append(template);
		i++;
	}
}
