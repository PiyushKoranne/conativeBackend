

function geteditform(editid){
	// alert(editid);
	  $.ajax({
	  url:"/gallerSlideItem-edit/"+editid,
	  method:"GET",
	  success: function(response){
		console.log(response);
		  $('#editid').val(editid);
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