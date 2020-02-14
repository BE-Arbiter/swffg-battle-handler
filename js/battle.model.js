//Définition du contexte global de l'application
let context = {
	counter : 0,
	typesPj:{
		emptyValue: {code:null,label:""},
		list:  [{code:"PJ",label:"Personnage joueur"},{code:"PNJ",label:"Personnage non joueur"}]
	},
	typeCombats:{
		emptyValue: null,
		list: [{code:"NOM",label:"Initiative Nominative"},{code:"TYPE",label:"Initiative par type ( PJ / PNJ )"},{code:"GROUPE",label:"Initiative par groupe"}]
	},
	combatActuel: null,
	combats: []
};

//Définition d'un personnage
class Personnage{
	constructor(baseTag){
		this.id = context.counter++;
		this.effets = [];
		if(baseTag && baseTag.length){
			this.updateFromBaseTag(baseTag);
		}
		else{
			this.nom = "";
		}
		this.hasPlayed = false;
	}
	id;
	nom;
	hasPlayed;
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
					context.combatActuel.personnageCourant.updateFromBaseTag($("#personnageCourant"));
					refreshListPersonnage();
				});
			}
		}
	};
}
//Définition d'un effet "préjudiciable"
class Effet{
	nom;
	description;
	dureeTotale;
	dureeRestante;
}
//Définition de l'init Tracker
class Initiative{
	constructor() {
		this.label = "";
		this.value = 0;
		this.last = false;
		this.group = "";
	}
	label;
	group;
	value;
	last;
}

//Définition d'un combat
class Combat{
	constructor(baseTag){
		this.personnageCourant = new Personnage();
		this.personnageList = [this.personnageCourant];
		this.personnageInactifs =  [];
		this.lastInit =  null;
		this.initiatives = [];
		this.typeCombat = "NOM";
		this.currentInitiativeIndex;
	}
	typeCombat; //Groupe , Type ou Nominatif
	initiatives;
	currentInitiativeIndex;
	personnageCourant;
	personnageList;
	personnageInactifs;
	lastInit;

	updateFromBaseTag(baseTag){
		if(baseTag && baseTag.length){
			//ChampsConcernés : typeCombat
			this.typeCombat = baseTag.find(".inputTypeCombat").val();
		}
	};

	updateToBaseTag(baseTag){
		if(baseTag && baseTag.length){
			//Mettre à jour les tags en fonction ? En cas de chargement...
		}
	};
}

context.combatActuel = new Combat();
context.combats = [context.combatActuel];
