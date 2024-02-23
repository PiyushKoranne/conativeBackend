const uploaderElement = document.querySelector(".user-all-user-uploader");
uploaderElement.addEventListener("change", readURL)

const editElement = document.querySelector("#userview");
editElement.addEventListener("click", getuserviewform);

function getuserviewform(event){
	const uid = event.target.dataset.identifier;
    // alert(uid);
    $.ajax({
    url:"/getuserbyid/"+uid,
    method:"GET",
    success: function(response){
      // alert(response.email);
      $('#editid').val(response._id);
      $('#username').val(response.username);
      $('#email').val(response.email);
      $('#phone').val(response.phone);
      $('#address').val(response.address);
      $('#preimage').val(response.userPhoto);
        if(response.userPhoto != ''){
        $('#clientimageupdate').attr('src', '<%= frontend_url %>'+response.userPhoto).width(100).height(100); 
        }else{
        $('#clientimageupdate').attr('src', '../images/user.png').width(100).height(100); 
        }
      $('#usertable').hide();
      $('#userviewdata').show();
      
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
      $('#clientimageupdate').attr('src', e.target.result).width(100).height(100);
    };

    reader.readAsDataURL(input.files[0]);
  }
}