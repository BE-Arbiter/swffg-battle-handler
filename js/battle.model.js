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
	combats: [],
	heightObserver: null

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
		this.clazz= "PERSONNAGE"
	}
	id;
	nom;
	hasPlayed;
	type; //Ceci est un "enum"
	groupe;
	taillePack;
	blessure;
	blessureSeuil;
	stress;
	stressSeuil;
	conflit;
	moralite;
	soak;
	defense;
	adversary;
	initiative;
	effets;
	clazz;

	updateFromBaseTag(baseTag){
		if(baseTag && baseTag.length){
			this.nom = baseTag.find(".inputNom").val();
			this.type = baseTag.find(".inputType").val();
			this.groupe = baseTag.find(".inputGroupe").val();
			this.soak = baseTag.find(".inputSoak").val();
			this.defense = baseTag.find(".inputDefense").val();
			this.adversary = getNumber(baseTag.find(".inputAdversary").val());
			this.initiative = getNumber(baseTag.find(".inputInitiative").val());
			this.blessure = getNumber(baseTag.find(".inputBlessure").val());
			this.blessureSeuil = getNumber(baseTag.find(".inputBlessureSeuil").val());
			this.stress = getNumber(baseTag.find(".inputStress").val());
			this.stressSeuil = getNumber(baseTag.find(".inputStressSeuil").val());
			this.conflit = getNumber(baseTag.find(".inputConflit").val());
			this.moralite = getNumber(baseTag.find(".inputMoralite").val());
			this.taillePack = baseTag.find(".inputTaillePack").val();
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
			baseTag.find(".inputBlessure").val(this.blessure);
			baseTag.find(".inputBlessureSeuil").val(this.blessureSeuil);
			baseTag.find(".inputStress").val(this.stress);
			baseTag.find(".inputStressSeuil").val(this.stressSeuil);
			baseTag.find(".inputConflit").val(this.conflit);
			baseTag.find(".inputMoralite").val(this.moralite);
			baseTag.find(".inputTaillePack").val(this.taillePack);
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
		this.from = null;
	}
	label;
	group;
	value;
	last;
	from;
}

//Définition d'un combat
class Combat{
	constructor(baseTag){
		this.id = context.counter++;
		this.personnageCourant = new Personnage();
		this.personnageList = [this.personnageCourant];
		this.personnageInactifs =  [];
		this.playedInitiatives =  [];
		this.initiatives = [];
		this.typeCombat = "NOM";
		this.nom = "Nouveau Combat";
		this.currentInitiativeIndex;
		this.clazz= "COMBAT"
	}
	id;
	typeCombat; //Groupe , Type ou Nominatif
	initiatives;
	currentInitiativeIndex;
	personnageCourant;
	personnageList;
	personnageInactifs;
	playedInitiatives;
	nom;
	clazz;

	updateFromBaseTag(baseTag){
		if(baseTag && baseTag.length){
			this.nom = baseTag.find(".inputNomCombat").val();
			this.typeCombat = baseTag.find(".inputTypeCombat").val();
		}
	};

	updateToBaseTag(baseTag){
		if(baseTag && baseTag.length){
			baseTag.find(".inputNomCombat").val(this.nom);
			baseTag.find(".inputTypeCombat").val(this.typeCombat);
			let selectActifs = baseTag.find(".inputActifsCombat");
			selectActifs.empty();
			for(let personnage of this.personnageList){
				let nomToAdd = "Nouveau Personnage";
				if(personnage.nom){
					nomToAdd = personnage.nom;
				}
				selectActifs.append('<option value="'+personnage.id+'">'+nomToAdd+'</option>')
			}
			let selectInactifs = baseTag.find(".inputInactifsCombat");
			selectInactifs.empty();
			for(let personnage of this.personnageInactifs){
				let nomToAdd = "Nouveau Personnage";
				if(personnage.nom){
					nomToAdd = personnage.nom;
				}
				selectInactifs.append('<option value="'+personnage.id+'">'+nomToAdd+'</option>')
			}
		}
	};
}

context.combatActuel = new Combat();
context.combats = [context.combatActuel];

