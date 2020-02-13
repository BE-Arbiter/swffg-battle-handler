class Personnage{
	constructor(baseTag){
		this.id = counter++;
		this.updateFromBaseTag = Personnage.prototype.updateFromBaseTag;
		this.updateToBaseTag = Personnage.prototype.updateToBaseTag;
		if(baseTag && baseTag.length){
			this.updateFromBaseTag(baseTag);
		}
		else{
			this.nom = "";
		}
	}
	id;
	nom;
	type; //Ceci est un "enum"
	groupe;
	soak;
	defense;
	adversary;
	initiative;
	effets;

	updateFromBaseTag(baseTag){
		if(baseTag && baseTag.length){
			this.nom = baseTag.find(".inputNom").val();
			this.type = baseTag.find(".inputType").val();
			this.groupe = baseTag.find(".inputGroupe").val();
			this.soak = baseTag.find(".inputSoak").val();
			this.defense = baseTag.find(".inputDefense").val();
			this.adversary = baseTag.find(".inputAdversary").val();
			this.initiative = baseTag.find(".inputInitiative").val();
			//TODO Traiter les effets
			//this.nom = baseTag.children(".inputEffets?").val()
		}
	};

	updateToBaseTag(baseTag){
		if(baseTag && baseTag.length){
			baseTag.find(".inputNom").val(this.nom);
			baseTag.find(".inputType").val(this.type);
			baseTag.find(".inputGroupe").val(this.groupe);
			baseTag.find(".inputSoak").val(this.soak);
			baseTag.find(".inputDefense").val(this.defense);
			baseTag.find(".inputAdversary").val(this.adversary);
			baseTag.find(".inputInitiative").val(this.initiative);
			//TODO Traiter les effets
			//this.nom = baseTag.children(".inputEffets?").val()
		}
	};
}