function geteditform(editid){
	// alert(editid);
	  $.ajax({
	  url:"/getindustrieitem/"+editid,
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
  
   function readURL(input) {
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