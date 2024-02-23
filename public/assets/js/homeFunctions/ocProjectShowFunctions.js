const editElement = document.querySelector("#home-oc-project-edit-form");
editElement.addEventListener("click", geteditform)

const uploaderElements = document.querySelectorAll(".home-oc-project-uploader");
uploaderElements.forEach(element => {
	element.addEventListener("change", readURL);
})

function geteditform(event){
	const editid = event.target.dataset.identifier;
	// alert(editid);
	  $.ajax({
	  url:"/getclientprojectitem/"+editid,
	  method:"GET",
	  success: function(response){
		// alert(response);
		  $('#editid').val(editid);
		  $('#name').val(response.name);
		  $('#projectNumber').val(response.num);
		  $('#projectNumberSuffix').val(response.num_suffix);
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
  
   function getTestimonialEditform(editid){
	// alert(editid);
	  $.ajax({
	  url:"/getTestimonialItem/"+editid,
	  method:"GET",
	  success: function(response){
		// alert(response);
		  $('#testimonialEditid').val(editid);
		  $('#testimonial_name').val(response.name);
		  $('#designation').val(response.designation);
		  $('#testimonial_content').val(response.content);
		  $('#testimonialvideoupdate').text(response.video);
		  $('#testpreimage').val(response.image);
		  $('#testprevideo').val(response.video);
		  if(response.image != ''){
		  $('#testimonialimageupdate').attr('src', '<%= frontend_url %>'+response.image).width(100).height(100); 
		  }else{
		  $('#testimonialimageupdate').attr('src', '/images/user.png').width(100).height(100); 
		  }
		  $('#addTestimonial').hide();
		  $('#testimonialViewForm').hide();
		  $("#addTestimonialForm").hide();
		  $('#testimonialeditform').show();
		  $("#editTestimonialform").show();
		
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
		$('#insertimage').attr('src', e.target.result).width(100).height(100);
		$('#clientimageupdate').attr('src', e.target.result).width(100).height(100);
	  };
  
	  reader.readAsDataURL(input.files[0]);
	}
  }