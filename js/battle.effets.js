//Gestion des effets
function deleteEffet(index){
	if(typeof(index) === "number"){
		context.combatActuel.personnageCourant.effets.splice(index,1);
		context.combatActuel.personnageCourant.updateToBaseTag($("#personnageCourant"));
		refreshSize();
	}
}

function addEffet(){
	if(!context.combatActuel.personnageCourant.effets){
		context.combatActuel.personnageCourant.effets = [];
	}
	context.combatActuel.personnageCourant.effets.push(new Effet());
	context.combatActuel.personnageCourant.updateToBaseTag($("#personnageCourant"));
	refreshSize();
}