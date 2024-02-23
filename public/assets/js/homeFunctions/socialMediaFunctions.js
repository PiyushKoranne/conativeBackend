const editElement = document.querySelector("#home-social-media-edit-form");
editElement.addEventListener("click", geteditform);

const uploaderElements = document.querySelectorAll(".home-social-media-uploader");
uploaderElements.forEach(element => {
	element.addEventListener("change", readURL);
})

function geteditform(event){
	const editid = event.target.dataset.identifier;
	// alert(editid);
	  $.ajax({
	  url:"/getsocialitem/"+editid,
	  method:"GET",
	  success: function(response){
		// alert(response);
		  $('#editid').val(editid);
		  $('#title').val(response.title);
		  $('#socialurl').val(response.socialurl);
		  $('#description').val(response.description);
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
	  //  alert("ftype");
	  reader.onload = function (e) {
		$('#insertimage').attr('src', e.target.result).width(100).height(100);
		$('#clientimageupdate').attr('src', e.target.result).width(100).height(100);
	  };
  
	  reader.readAsDataURL(input.files[0]);
	}
  }