const uploaderElements = document.querySelectorAll(".posttype-graphic-design-uploader");
uploaderElements.forEach(ele => {
	ele.addEventListener("change", readURL);
})

const editElement = document.querySelector("#posttype-graphic-design-edit");
editElement.addEventListener("click", graphicDesignPost_edit);

function graphicDesignPost_edit(event){
	const editid = event.target.dataset.identifier;
	// alert(editid);
	  $.ajax({
	  url:"/getGraphicDesignPost/"+editid,
	  method:"GET",
	  success: function(response){
  
		  var images = response.images;
		
		  $('#editid').val(editid);
		  $('#post_meta_title').val(response.meta_title);
		  $('#post_meta_desc').val(response.meta_desc);
		  $('#post_meta_keywords').val(response.meta_keywords);
		  $('#title').val(response.title);
		  $('#post-content-edit').html(response.post_content);
		  postContentEdit.setData(response.post_content);
		  $('#slug').val(response.slug);
		  $("#design_type").val(response.design_type);
		  // $("#design_type").attr('disabled', 'disabled');
		  $(".uploaded_item").remove();
		  $.each(images, function( index, value ) {
			$("#uploaded_items").append(
			  '<div class="mb-3 col-md-8 uploaded_item"><input type="hidden" name="uploaded_images[]" value="'+value+'" class="form-control"><img crossorigin="anonymous" src="<%= frontend_url %>'+value+'" alt="your image" width="100px" height="100px" style="width: 100px; height: 100px;" /><label class="form-label mx-4">'+value+'</label><button class="remove btn button-white uppercase col-md-5" image-name="'+value+'">Remove</button></div>'
			  );
		  });
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