const uploadelements = document.querySelectorAll(".file-upload-about");
uploadelements.forEach(element => {
	element.addEventListener("change", readURL);
})

const tourslideElement = document.querySelector("#about-tour-slideitem-edit");
tourslideElement.addEventListener("click", tourSlideItem_edit);

const chooseContentElement = document.querySelector("#about-choose-content-item");
chooseContentElement.addEventListener("click", chooseContentItem_edit);

function readURL(event) {
	const input = event.target
	if (input.files && input.files[0]) {
	  var reader = new FileReader();
	  //  alert("ftype");
	  reader.onload = function (e) {
		$('#insertimage').attr('src', e.target.result).width(100).height(100);
		$('#tourImage').attr('src', e.target.result).width(100).height(100);
	  };
  
	  reader.readAsDataURL(input.files[0]);
	}
  }

  function tourSlideItem_edit(event){
	const editid = event.target.dataset.identifier;
	  $.ajax({
	  url:"/tourSlideItem_edit/"+editid,
	  method:"GET",
	  success: function(response){
		// alert(response);
		  $('#editid').val(editid);
		  $('#tour_item_title').val(response.tour_item_title);
		  $('#tour_item_content').val(response.tour_item_content);
		  $('#tour_item_year').val(response.tour_item_year);
		  $('#oldimage').attr('value',response.image);
		  if(response.image != ''){
		  $('#tourImage').attr('src', '<%= frontend_url %>'+response.image).width(100).height(100); 
		  }else{
		  $('#tourImage').attr('src', '/images/user.png').width(100).height(100); 
		  }
		  $('#tourItemviewForm').hide();
		  $('#tourItem').hide();
		  $('#editTourItem').show();
		  $("#touritemeditform").show();
		
		}
	  });
	  return false;
   }
   
  
   function chooseContentItem_edit(event){
	const editid = event.target.dataset.identifier;
	  $.ajax({
	  url:"/chooseContentItem_edit/"+editid,
	  method:"GET",
	  success: function(response){
		// alert(response);
		  $('#chooseEditid').val(editid);
		  $('#choose_title').val(response.choose_title);
		  $('#choose_content').val(response.choose_content);
		  $('#chooseItemviewForm').hide();
		  $('#chooseItem').hide();
		  $('#editChooseItem').show();
		  $("#chooseitemeditform").show();
		}
	  });
	  return false;
   }