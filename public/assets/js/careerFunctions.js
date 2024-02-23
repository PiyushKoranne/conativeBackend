const uploadElements = document.querySelectorAll(".career-file-upload");
uploadElements.forEach(element => {
	element.addEventListener("change", readURL)
})

const careerPerkElement = document.querySelector("#career-perk-slide-item");
careerPerkElement.addEventListener("click", perksSlideItem_edit)

function readURL(event) {
	const input = event.target;
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
  function perksSlideItem_edit(event){
	const editid = event.target.dataset.identifier;
	  $.ajax({
	  url:"/perksSlideItem_edit/"+editid,
	  method:"GET",
	  success: function(response){
		// alert(response);
		  $('#editid').val(editid);
		  $('#perks_item_title').val(response.perks_item_title);
		  $('#oldimage').attr('value',response.image);
		  if(response.image != ''){
		  $('#perksImage').attr('src', '<%= frontend_url %>'+response.image).width(100).height(100); 
		  }else{
		  $('#perksImage').attr('src', '/images/user.png').width(100).height(100); 
		  }
		  $('#perksItemviewForm').hide();
		  $('#perksItem').hide();
		  $('#editperksItem').show();
		  $("#perksitemeditform").show();
		
		}
	  });
	  return false;
   }