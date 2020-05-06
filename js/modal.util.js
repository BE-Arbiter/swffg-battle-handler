let modal = { counter : 0};

modal.warn = (text,title) =>{
	title = title || "Attention";
	if(!text){
		console.error("J'ai besoin d'un texte à afficher");
		return;
	}
	modal.showModal({title:title,text:text});
};
/* Options Exemples :
{
	title:string, default "Attention"
	text:string, default "Êtes vous sur de vouloir effectuer cette action?
	confirmButtonText : Change le texte du bouton "Confirmer";
	onConfirm: function, to Execute before hiding the popup in case of confirm press;
	onConfirmArguments: array, default [];
	showCancelButton: boolean, default false;
	cancelButtonText: Change le texte du bouton "Annuler"
	onCancel: function To execute before hiding the popup in case of cancel press
	onCancelArguments: array, default [];
}
 */
modal.askConfirm = (options) =>{
	modal.showModal(options)
};

modal.showModal = (options) =>{
	options = options || {};
	let title = options.title || "Attention";
	let text = options.text || "Êtes vous sur de vouloir effectuer cette action?";
	let showCancelButton = options.showCancelButton || false;
	let confirmButtonText = options.confirmButtonText || "Confirmer";
	let cancelButtonText = options.cancelButtonText || "Annuler";
	let onConfirmArguments = options.onConfirmArguments || {};
	//On force à "onConfirmArguments" si c'est un nombre (dans le cas ou c'est zero);
	if(typeof (options.onConfirmArguments) === "number"){
		onConfirmArguments = options.onConfirmArguments;
	}
	let onCancelArguments = options.onCancelArguments || {};
	if(typeof (options.onCancelArguments) === "number"){
		onCancelArguments = options.onCancelArguments;
	}
	idModal = 'modal_'+(modal.counter++);
	let modalTemplate = getHtmlFromFile("./html/modals/baseModalTemplate.html");
	modalTemplate = modalTemplate.split("TITLE_PLACEHOLDER").join(title);
	modalTemplate = modalTemplate.split("TEXT_PLACEHOLDER").join(text);
	modalTemplate = modalTemplate.split("CONFIRM_BUTTON_LABEL").join(confirmButtonText);
	modalTemplate = modalTemplate.split("CANCEL_BUTTON_LABEL").join(cancelButtonText);
	modalTemplate = modalTemplate.split("CONFIRM_ARGS").join(JSON.stringify(onConfirmArguments));
	modalTemplate = modalTemplate.split("CANCEL_ARGS").join(JSON.stringify(onCancelArguments));
	modalTemplate = modalTemplate.split("ID_MODALE").join(idModal);


	if(showCancelButton){
		modalTemplate = modalTemplate.split("SHOW_CANCEL_START").join("");
		modalTemplate = modalTemplate.split("SHOW_CANCEL_END").join("");
	}
	else{
		modalTemplate = modalTemplate.split("SHOW_CANCEL_START").join("<!--");
		modalTemplate = modalTemplate.split("SHOW_CANCEL_END").join("-->");

	}
	modal[idModal] = {};
	if(options.onConfirm){
		modal[idModal].confirm = ((modalId,confirmArguments) => {
			options.onConfirm(confirmArguments);
			modal.remove(modalId);
		});
	}
	else{
		modal[idModal].confirm = ((modalId) => {
			modal.remove(modalId);
		});
	}
	if(options.onCancel){

		modal[idModal].cancel = ((modalId,CancelArguments) => {
			options.onCancel(CancelArguments);
			modal.remove(modalId);
		});
	}
	else{
		modal[idModal].cancel = ((modalId) => {
			modal.remove(modalId);
		});
	}
	//Si une modale de ce type existe, on l'ejecte
	$("body").append(modalTemplate);
	$('#'+idModal).modal();
};

modal.remove = (id) => {
	let myModal = $('#'+id);
	myModal.modal('hide');
	setTimeout( () =>{
		myModal.remove();
		modal[id] = undefined;
	},250);
};