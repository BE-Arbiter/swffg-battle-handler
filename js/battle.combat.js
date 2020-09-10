function applyCombatName(){
	if(!context.combatActuel){
		return;
	}
	let typeCombat = "";
	for(let type of context.typeCombats.list){
		if(type.code === context.combatActuel.typeCombat){
			typeCombat = type.label;
		}
	}
	const combat_name = context.combatActuel.nom + " : "+typeCombat;
	$("#battle_information").text(combat_name);
}

function selectCombat(id){
	id = Number(id);
	for(let tmpCombat of context.combats){
		if(tmpCombat.id === id){
			context.combatActuel = tmpCombat;
			context.combatActuel.updateToBaseTag($("#combat_modal"));
			refreshListCombat();
			refreshListPersonnage();
			applyCombatName();
			refreshInactiveCharacterList();
			cleanInitiatives();
			applyInitiativesToTag($("#listInitiatives"));
			tmpCombat.personnageCourant.updateToBaseTag($('#personnageCourant'))
			return;
		}
	}
}

function refreshListCombat(){
	//Nettoyer le select
	let select = $("#combatSelect");
	select.empty();
	//Parcourir les combats
	for(let combatTmp of context.combats){
		select.append('<option value="'+combatTmp.id+'">'+combatTmp.nom+'</option>')
	}
	//Sélectionner le combat Courant
	select.val(context.combatActuel.id);
}

function addCombatToList(toAdd){
	context.combatActuel = toAdd;
	context.combats.push(context.combatActuel);
	refreshListCombat();
	selectCombat(toAdd.id);
}

function loadCombat(evenement){
	if (evenement.files && evenement.files[0]) {
		var myFile = evenement.files[0];
		var reader = new FileReader();
		
		reader.addEventListener('load', function (e) {
			var newCombatData = JSON.parse(reader.result);
			if(newCombatData.clazz !== "COMBAT"){
				console.error("Le type de fichier chargé n'est pas de type COMBAT, mais de type "+newPersonnageData.clazz);
				return;
			}
			addCombatToList(reviveCombatFromData(newCombatData));
		});
		reader.readAsText(myFile);
	 }   
}

function reviveCombatFromData(data){
	var newCombat = new Combat();
	for(let prop in data){
		//L'id est déjà auto-générée dans le constructeur.
		if(prop === "id"){
			continue;
		}
		newCombat[prop] = data[prop];
	}
	//Pour chaque personnage il va falloir faire un "revive aussi"
	for(let i = 0; i < newCombat.personnageList.length;i++){
		let personnageData = newCombat.personnageList[i];
		let savedId = personnageData.id;
		let personnage = revivePersonnageFromData(personnageData);
		newCombat.personnageList[i] = personnage;
		if(savedId === newCombat.personnageCourant.id){
			newCombat.personnageCourant = personnage;
		}
	}
	for(let i = 0; i < newCombat.personnageInactifs.length;i++){
		let personnageData = newCombat.personnageInactifs[i];
		let personnage = revivePersonnageFromData(personnageData);
		newCombat.personnageInactifs[i] = personnage;
	}
	return newCombat;
}

function deleteCombat(){
	if(!context.combatActuel){
		return;
	}
	if(context.combats.length === 1){
		modal.warn("Vous ne pouvez pas supprimer le dernier combat.");
		return;
	}
	for(let i = 0; i < context.combats.length ; i++){
		if(context.combats[i].id === context.combatActuel.id){
			context.combats.splice(i,1);
			break;
		}
	}
	context.combatActuel = context.combats[0];
	refreshListCombat();
}

//Sauvegarde
function saveCombat(){
	var tmpCombat = context.combatActuel;
	if(tmpCombat.nom == null || tmpCombat.nom === "Nouveau Combat"){
		return;
	}
	var text = JSON.stringify(tmpCombat);
	var fileName = tmpCombat.nom;
	fileName+= ".json";
	var blob = new Blob([text],{type:"application/json"});
	download(blob,fileName);
}
