const uploaderElements = document.querySelectorAll(".testimonial-uploader");
uploaderElements.forEach(item => {
	item.addEventListener("change", readURL)
})

const editElement = document.querySelector("#testimonial-edit-form");
editElement.addEventListener("click", getTestimonialEditform)

function geteditform(editid){
	// alert(editid);
	  $.ajax({
	  url:"/getTeamitem/"+editid,
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
	  //  alert("ftype");
	  reader.onload = function (e) {
		$('#insertimage').attr('src', e.target.result).width(100).height(100);
		$('#clientimageupdate').attr('src', e.target.result).width(100).height(100);
	  };
  
	  reader.readAsDataURL(input.files[0]);
	}
  }
  
  function getTestimonialEditform(event){
	const editid = event.target.dataset.identifier;
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
		  $('#thumbpreimage').val(response.thumbImage);
		  $('#testprevideo').val(response.video);
		  if(response.show_homepage == "true"){
			$("#show_homepage").prop("checked", true);
		  }else{
			$("#show_homepage").prop("checked", false);
		  }
		  if(response.image != ''){
		  $('#testimonialimageupdate').attr('src', '<%= frontend_url %>'+response.image).width(100).height(100); 
		  }else{
		  $('#testimonialimageupdate').attr('src', '/images/user.png').width(100).height(100); 
		  }
		  if(response.thumbImage != ''){
		  $('#thumbimage').attr('src', '<%= frontend_url %>'+response.thumbImage).width(100).height(100); 
		  }else{
		  $('#thumbimage').attr('src', '/images/user.png').width(100).height(100); 
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