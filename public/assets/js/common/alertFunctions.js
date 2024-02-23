const element = document.querySelector("#noty-confirm-alert-btn");
element.addEventListener("click", notyConfirm);

function notyConfirm(){
	noty({
		text: 'Do you want to continue?',
		layout: 'topRight',
		buttons: [
				{addClass: 'btn btn-success btn-clean', text: 'Ok', onClick: function($noty) {
					$noty.close();
					noty({text: 'You clicked "Ok" button', layout: 'topRight', type: 'success'});
				}
				},
				{addClass: 'btn btn-danger btn-clean', text: 'Cancel', onClick: function($noty) {
					$noty.close();
					noty({text: 'You clicked "Cancel" button', layout: 'topRight', type: 'error'});
					}
				}
			]
	})                                                    
} 