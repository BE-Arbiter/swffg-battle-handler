//Compteur pour générer des nombres uniques
let counter = 0;
//Inclusion des modals et includes
$(document).ready(function() {
	$("#menu").load("./html/menu.html");
	/* Chargement du principal un peu particulier pour le resize */
	$("#turn-order").load("./html/turn-order.html", function(){
		$("#main-panel").load("./html/main-panel.html", function(){
			var leftPanel = $("#turn-order .panel-auto-size");
			var panelRight = $("#main-panel .panel-auto-size");
			adjustSize(leftPanel,panelRight);
				
			//Initialiser le combat;
			refreshListPersonnage();
			
			$("#personnageCourant .form-control").change(() =>{
				personnageCourant.updateFromBaseTag($("#personnageCourant"));
				refreshListPersonnage();
			});
			
		});
	});
	
});
//Recalcul auto
$(window).resize(function() {				
	var leftPanel = $("#turn-order .panel-auto-size");
	var panelRight = $("#main-panel .panel-auto-size");
	
	adjustSize(leftPanel,panelRight);
});


//Gestion des hauteurs de colonnes pour un joli layout
function adjustSize(panelLeft,panelRight){
	resetSize(panelLeft, panelRight);
	if($(window).width() > 991){
		var height_panelLeft = panelLeft.height();
		var height_panelRight = panelRight.height();
		var max_height = (height_panelLeft > height_panelRight) ? height_panelLeft : height_panelRight;
		panelLeft.height(max_height);
		panelRight.height(max_height);
	}
}

function resetSize(panelLeft,panelRight){
	panelLeft.height("auto");
	panelRight.height("auto");
}

//Téléchargement
function download(blob, filename) {
	let a = document.createElement("a");
	document.body.appendChild(a);
	a.setAttribute('style', 'display:none;');
	let url = window.URL.createObjectURL(blob);
	a.download = filename;
	a.href = url;
	a.click();
}

//Récupération d'un fichier Externe
function getHtmlFromFile(filename){
	var html;
	$.ajax({
		dataType: "html",
		crossDomain: true,
		async: false,
		method: 'get',
		url: filename,
		success: function(data){
			html = data;
		}
	});
	return html;
}