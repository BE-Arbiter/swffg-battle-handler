function deleteEffet(index){
	if(typeof(index) === "number"){
		personnageCourant.effets.splice(index,1);
		personnageCourant.updateToBaseTag($("#personnageCourant"));
	}
}

function addEffet(){
	if(!personnageCourant.effets){
		personnageCourant.effets = [];
	}
	personnageCourant.effets.push(new Effet());
	personnageCourant.updateToBaseTag($("#personnageCourant"));
}