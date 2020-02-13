let modal = {};
/* Options Exemples :
{
	title:string, default "Attention"
	text:string, default "Êtes vous sur de vouloir effectuer cette action?
	onConfirm: function, to Execute before hiding the popup in cadse of confirm press;
	showCancelButton: boolean, default false;
	onCancel: function To execute before hiding the popup in case of cancel press
}
 */
modal.askConfirm = (options) =>{
	options = options || {};
	let title = options.title || "Attention";
	let text = options.text || "Êtes vous sur de vouloir effectuer cette action?";
	let showCancelButton = options.showCancelButton || false;
	let modalTemplate = getHtmlFromFile("./html/modals/confirmModalTemplate.html");
	modalTemplate = modalTemplate.split("TITLE_PLACEHOLDER").join(title);
	modalTemplate = modalTemplate.split("TEXT_PLACEHOLDER").join(text);
	if(showCancelButton){
		modalTemplate = modalTemplate.split("SHOW_CANCEL_START").join("");
		modalTemplate = modalTemplate.split("SHOW_CANCEL_END").join("");
	}
	else{
		modalTemplate = modalTemplate.split("SHOW_CANCEL_START").join("<!--");
		modalTemplate = modalTemplate.split("SHOW_CANCEL_END").join("-->");

	}
	if(options.onConfirm){
		modal.confirm = (() => { options.onConfirm(); $('#confirm_modal').modal('hide'); });
	}
	else{
		modal.confirm = (() => { $('#confirm_modal').modal('hide'); });
	}
	if(options.onCancel){
		modal.cancel = (() => { options.onCancel(); $('#confirm_modal').modal('hide'); });
	}
	else{
		modal.cancel = (() => { $('#confirm_modal').modal('hide'); });
	}
	//Si la modal de confirmation existe, on l'ejecte
	let confirmModal = $("#confirm_modal");
	if(confirmModal.length){
		confirmModal.remove();
	}
	$("body").append(modalTemplate);
	$("#confirm_modal").modal();


};
