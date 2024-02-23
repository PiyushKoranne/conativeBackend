const editElement = document.querySelector("#posttype-career-post-edit-form");
editElement.addEventListener("click", careerpost_edit);

const uploaderElements = document.querySelectorAll(".posttype-career-uploader");
uploaderElements.forEach(element => {
	element.addEventListener("change", readURL)
})

function careerpost_edit(event){
	const editid = event.target.dataset.identifier;
	// alert(editid);
	  $.ajax({
	  url:"/getCareerPost/"+editid,
	  method:"GET",
	  success: function(response){
		// alert(response);
		  $('#editid').val(editid);
		  $('#meta_title').val(response.meta_title);
		  $('#meta_desc').val(response.meta_desc);
		  $('#meta_keywords').val(response.meta_keywords);
		  $('#title').val(response.title);
		  $('#slug').val(response.slug);
		  $('#desc').val(response.description);
		  $('#content').html(response.content);
		  content.setData(response.content);
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