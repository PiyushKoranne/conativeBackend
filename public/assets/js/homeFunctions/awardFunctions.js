const uploaderElements = document.querySelectorAll(".home-award-uploader");
uploaderElements.forEach(element => {
	element.addEventListener("change", readURL);
})

const editFormElement = document.querySelector("#home-award-edit-form");
editFormElement.addEventListener("click", geteditform)

function geteditform(event){
	const editid = event.target.dataset.identifier;
	// alert(editid);
	  $.ajax({
	  url:"/getawradsitem/"+editid,
	  method:"GET",
	  success: function(response){
		// alert(response);
		  $('#editid').val(editid);
		  $('#name').val(response.name);
		  $('#description').html(response.description);
		  $('#preimage').val(response.image);
		  if(response.image != ''){
		  $('#clientimageupdate').attr('src', '<%= frontend_url %>'+response.image).width(100).height(100); 
		  }else{
		  $('#clientimageupdate').attr('src', '/images/user.png').width(100).height(100); 
		  }
		  $('#ouritemForm').hide();
		  $('#ouritemviewForm').hide();
		  $("#ouritem").hide();
		  $('#edititemform').show();
		  $("#itemeditform").show();
		
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
		// $('#clientprojectimage').attr('src', e.target.result).width(100).height(100);
		$('#insertimage').attr('src', e.target.result).width(100).height(100);
		$('#clientimageupdate').attr('src', e.target.result).width(100).height(100);
	  };
  
	  reader.readAsDataURL(input.files[0]);
	}
  }