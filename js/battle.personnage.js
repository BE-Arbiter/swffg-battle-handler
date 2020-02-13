let emptyValue = {code:null,label:""};
let typesList = [{code:"PJ",label:"Personnage joueur"},{code:"PNJ",label:"Personnage non joueur"}];
let personnageList = [];
let personnageCourant = null;
let lastInit = null;

function selectPersonnage(id){
	for(let tmpPersonnage of personnageList){
		if(tmpPersonnage.id == id){
			personnageCourant = tmpPersonnage;
			personnageCourant.updateToBaseTag($("#personnageCourant"));
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
	for(let personnageTmp of personnageList){
		let nomToAdd = "Nouveau Personnage";
		if(personnageTmp.nom){
			nomToAdd = personnageTmp.nom;
		}
		select.append('<option value="'+personnageTmp.id+'">'+nomToAdd+'</option>')
		if(personnageCourant && personnageCourant.nom === personnageTmp.nom){
			hasPersonnageCourrant = true;
		}
	}
	//Sélectionner le personnage courrant si il existe encore;
	if(hasPersonnageCourrant){
		$('#personnageSelect option[value='+personnageCourant.id+']').attr('selected','selected');
	}
	else if(personnageList.length > 0){
		personnageCourant = personnageList[0];
		personnageCourant.updateToBaseTag($("#personnageCourant"));
	}
	else{
		personnageCourant = null;
		$("#personnageCourant").addClass("hidden");
		$("#aucunPersonnagePlaceholder").removeClass("hidden");
	}
}

function addPersonnageToList(toAdd){
	personnageCourant = toAdd;
	personnageList.push(personnageCourant);
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
	if(!personnageCourant){
		return;
	}
	for(let i = 0; i < personnageList.length ; i++){
		if(personnageList[i].id === personnageCourant.id){
			personnageList.splice(i,1);
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