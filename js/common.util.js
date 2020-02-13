//Compteur pour générer des nombres uniques
let counter = 0;
//Recalcul auto
$(window).resize(function() {				
	var leftPanel = $("#turn-order .panel-auto-size");
	var panelRight = $("#main-panel .panel-auto-size");
	
	adjustSize(leftPanel,panelRight);
});

function getNumber(value){
	let number = Number(value);
	if(number !== number){
		return null;
	}
	return number;
}
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