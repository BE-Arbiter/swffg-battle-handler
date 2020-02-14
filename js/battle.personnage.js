function selectPersonnage(id){
	for(let tmpPersonnage of context.combatActuel.personnageList){
		if(tmpPersonnage.id == id){
			context.combatActuel.personnageCourant = tmpPersonnage;
			context.combatActuel.personnageCourant.updateToBaseTag($("#personnageCourant"));
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
		$('#personnageSelect option[value='+context.combatActuel.personnageCourant.id+']').attr('selected','selected');
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
			var newPersonnage = new Personnage();
			for(let prop in newPersonnageData){
				newPersonnage[prop] = newPersonnageData[prop];
			}
			addPersonnageToList(newPersonnage);
		});
		reader.readAsText(myFile);
	 }   
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