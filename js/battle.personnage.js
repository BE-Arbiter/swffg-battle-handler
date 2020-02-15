function selectPersonnage(id){
	for(let tmpPersonnage of context.combatActuel.personnageList){
		if(tmpPersonnage.id == id){
			context.combatActuel.personnageCourant = tmpPersonnage;
			context.combatActuel.personnageCourant.updateToBaseTag($("#personnageCourant"));
			checkButtons();
			return;
		}
	}
}

function refreshListPersonnage(){
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
	context.combatActuel.updateToBaseTag($("#combat_modal"));
	checkButtons();
}

function addPersonnageToList(toAdd){
	context.combatActuel.personnageCourant = toAdd;
	context.combatActuel.personnageList.push(context.combatActuel.personnageCourant);
	refreshListPersonnage();
	selectPersonnage(toAdd.id);
	$("#personnageCourant").removeClass("hidden");
	$("#aucunPersonnagePlaceholder").addClass("hidden");
}

function loadPersonnage(evenement){
	if (evenement.files && evenement.files[0]) {
		var myFile = evenement.files[0];
		var reader = new FileReader();
		
		reader.addEventListener('load', function (e) {
			var newPersonnageData = JSON.parse(reader.result);
			if(newPersonnageData.clazz !== "PERSONNAGE"){
				console.error("Le type de fichier chargé n'est pas de type PERSONNAGE, mais de type "+newPersonnageData.clazz);
			}
			addPersonnageToList(revivePersonnageFromData(newPersonnageData));
		});
		reader.readAsText(myFile);
	 }   
}

function revivePersonnageFromData(data){
	var newPersonnage = new Personnage();
	for(let prop in data){
		//L'id est déjà auto-générée dans le constructeur.
		if(prop === "id"){
			continue;
		}
		newPersonnage[prop] = data[prop];
	}
	return newPersonnage;
}
function deletePersonnage(){
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
function savePersonnage(){
	var tmpPersonnage = context.combatActuel.personnageCourant
	if(tmpPersonnage.nom == null || tmpPersonnage.nom === ""){
		return;
	}
	var text = JSON.stringify(tmpPersonnage);
	var fileName = tmpPersonnage.nom;
	fileName+= ".json";
	var blob = new Blob([text],{type:"application/json"});
	download(blob,fileName);
}

//Activer Un personnage
function activatePersonnage(){
	let idList = $("#combat_modal .inputInactifsCombat").val();
	for(let idString of idList) {
		let id = Number(idString);
		for (let i = 0; i < context.combatActuel.personnageInactifs.length; i++) {
			let personnage = context.combatActuel.personnageInactifs[i];
			if (personnage.id === id) {
				context.combatActuel.personnageInactifs.splice(i, 1);
				context.combatActuel.personnageList.push(personnage);
				refreshListPersonnage();
				context.combatActuel.updateToBaseTag($("#combat_modal"))
			}
		}
	}
}

//Desactiver un personnage
function desactivatePersonnage(){
	let idList = $("#combat_modal .inputActifsCombat").val();
	for(let idString of idList) {
		let id = Number(idString);
		for (let i = 0; i < context.combatActuel.personnageList.length; i++) {
			let personnage = context.combatActuel.personnageList[i];
			if (personnage.id === id) {
				context.combatActuel.personnageList.splice(i, 1);
				context.combatActuel.personnageInactifs.push(personnage);
				refreshListPersonnage();
				context.combatActuel.updateToBaseTag($("#combat_modal"))
			}
		}
	}
}