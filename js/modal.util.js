let modal = {};
/* Options Exemples :
{
	title:string, default "Attention"
	text:string, default "Êtes vous sur de vouloir effectuer cette action?
	onConfirm: function, to Execute before hiding the popup in cadse of confirm press;
	onConfirmArguments: array, default [];
	showCancelButton: boolean, default false;
	onCancel: function To execute before hiding the popup in case of cancel press
	onCancelArguments: array, default [];
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
		let onConfirmArguments = options.onConfirmArguments || {};
		//On force à "onConfirmArguments" si c'est un nombre;
		if(typeof (options.onConfirmArguments) === "number"){
			onConfirmArguments = options.onConfirmArguments;
		}
		modal.confirm = (() => { options.onConfirm(onConfirmArguments); $('#confirm_modal').modal('hide'); });
	}
	else{
		modal.confirm = (() => { $('#confirm_modal').modal('hide'); });
	}
	if(options.onCancel){
		let onCancelArguments = options.onCancelArguments || {};
		if(typeof (options.onCancelArguments) === "number"){
			onCancelArguments = options.onCancelArguments;
		}
		modal.cancel = (() => { options.onCancel(onCancelArguments); $('#confirm_modal').modal('hide'); });
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
