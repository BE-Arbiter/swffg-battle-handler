class Personnage{
	constructor(baseTag){
		this.id = counter++;
		this.effets = [];
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
			this.soak = getNumber(baseTag.find(".inputSoak").val());
			this.defense = getNumber(baseTag.find(".inputDefense").val());
			this.adversary = getNumber(baseTag.find(".inputAdversary").val());
			this.initiative = getNumber(baseTag.find(".inputInitiative").val());
			this.effets = [];
			baseTag.find(".effet_element").each((index,element) => {
				let effetTag = $( element );
				let effet = new Effet();
				effet.nom = effetTag.find(".inputEffetNom").val();
				effet.dureeRestante = getNumber(effetTag.find(".inputEffetDureeRestante").val());
				effet.dureeTotale = getNumber(effetTag.find(".inputEffetDureeTotale").val());
				effet.description = effetTag.find(".inputEffetDescription").val();
				this.effets.push(effet);
			});
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
			let listEffetsTag = baseTag.find(".ListEffets");
			if(this.effets.length === 0){
				baseTag.find(".effetPlaceholder").removeClass("hidden");
			}
			else{
				baseTag.find(".effetPlaceholder").addClass("hidden");
			}
			baseTag.find(".effet_element").remove();
			for(let i = 0; i < this.effets.length; i++){
				/* Créer le tag */
				let effet = this.effets[i];
				let template = getHtmlFromFile("./html/templates/templateEffet.html");
				template = template.split("INDEX_EFFET").join(i+'');
				listEffetsTag.append(template);
				/* Retrouver le tag */
				let effetTag = listEffetsTag.find(".effet_"+i);
				effetTag.find(".inputEffetNom").val(effet.nom);
				effetTag.find(".inputEffetDureeRestante").val(effet.dureeRestante);
				effetTag.find(".inputEffetDureeTotale").val(effet.dureeTotale);
				effetTag.find(".inputEffetDescription").val(effet.description);
				/* Attacher event Listener */
				effetTag.find(".form-control").change(() =>{
					personnageCourant.updateFromBaseTag($("#personnageCourant"));
					refreshListPersonnage();
				});
			}
		}
	};
}

class Effet{
	nom;
	description;
	dureeTotale;
	dureeRestante;
}
