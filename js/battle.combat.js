function selectCombat(id){
	for(let tmpPersonnage of context.combatActuel.personnageList){
		if(tmpPersonnage.id == id){
			context.combatActuel.personnageCourant = tmpPersonnage;
			context.combatActuel.personnageCourant.updateToBaseTag($("#personnageCourant"));
			checkButtons();
			return;
		}
	}
}

function refreshListCombat(){
	//Nettoyer le select
	let select = $("#personnageSelect");
	select.empty();
	//Parcourir les personnages
	let hasPersonnageCourrant = false;
	for(let personnageTmp of context.combatActuel.personnageList){
		let nomToAdd = "Nouveau Personnage";
		if(personnageTmp.nom){
			nomToAdd = personnageTmp.nom;
		}
		select.append('<option value="'+personnageTmp.id+'">'+nomToAdd+'</option>')
		if(context.combatActuel.personnageCourant && context.combatActuel.personnageCourant.nom === personnageTmp.nom){
			hasPersonnageCourrant = true;
		}
	}
	//Sélectionner le personnage courrant si il existe encore;
	if(hasPersonnageCourrant){
		$('#personnageSelect').val(context.combatActuel.personnageCourant.id);
		$("#personnageCourant").removeClass("hidden");
		$("#aucunPersonnagePlaceholder").addClass("hidden");
	}
	else if(context.combatActuel.personnageList.length > 0){
		context.combatActuel.personnageCourant = context.combatActuel.personnageList[0];
		context.combatActuel.personnageCourant.updateToBaseTag($("#personnageCourant"));
		$("#personnageCourant").removeClass("hidden");
		$("#aucunPersonnagePlaceholder").addClass("hidden");
	}
	else{
		context.combatActuel.personnageCourant = null;
		$("#personnageCourant").addClass("hidden");
		$("#aucunPersonnagePlaceholder").removeClass("hidden");
	}
	checkButtons();
}

function addCombatToList(toAdd){
	context.combatActuel.personnageCourant = toAdd;
	context.combatActuel.personnageList.push(context.combatActuel.personnageCourant);
	refreshListPersonnage();
	selectPersonnage(toAdd.id);
	$("#personnageCourant").removeClass("hidden");
	$("#aucunPersonnagePlaceholder").addClass("hidden");
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
	for(let i = 0; i < newCombat.personnageInactifs;i++){

	}
	return newCombat;
}
function deleteCombat(){
	if(!context.combatActuel.personnageCourant){
		return;
	}
	for(let i = 0; i < context.combatActuel.personnageList.length ; i++){
		if(context.combatActuel.personnageList[i].id === context.combatActuel.personnageCourant.id){
			context.combatActuel.personnageList.splice(i,1);
			break;
		}
	}
	refreshListPersonnage();
}

//Sauvegarde
function saveCombat(){
	var tmpPersonnage = new Personnage($("#personnageCourant"));
	if(tmpPersonnage.nom == null || tmpPersonnage.nom == ""){
		return;
	}
	var text = JSON.stringify(tmpPersonnage);
	var fileName = tmpPersonnage.nom;
	fileName+= ".json";
	var blob = new Blob([text],{type:"application/json"});
	download(blob,fileName);
}