const editElement = document.querySelector("#home-process-edit-form");
editElement.addEventListener("click", geteditform)

const uploaderElements = document.querySelectorAll(".home-process-show-uploader");
uploaderElements.forEach(element => {
	element.addEventListener("change", readURL)
})

function geteditform(event){
	const editid = event.target.dataset.identifier;
	$.ajax({
	url:"/getprocessplan/"+editid,
	method:"GET",
	success: function(response){
	
	   $('#userPhoto').val("");
	   $('#userPhotoupdate').val("");
	   $('#editid').val(editid);
	   $('#name').val(response.name);
	   $('#oldfile').val(response.image);
	   if(response.image != ''){
		$('#show-image').attr('src', response.image).width(100).height(100); 
	   }else{
		$('#show-image').attr('src', '/images/user.png').width(100).height(100); 
	   }
	   $('#processmainform').hide();
	   $('#form-wrapper-form').show();
	   $('#edititemform').show();
	   $('#processplanform').hide();
	   
	  }
	});
	return false;
	}
	
	function readURL(event) {
		const input = event.target;
	if (input.files && input.files[0]) {
	var reader = new FileReader();
	//  alert(ftype);
	reader.onload = function (e) {
	  $('#show-image').attr('src', e.target.result).width(100).height(100);
	  $('#create-show-image').attr('src', e.target.result).width(100).height(100);
	};
	
	reader.readAsDataURL(input.files[0]);
	}
	}