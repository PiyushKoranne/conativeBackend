const element = document.querySelector("#home-home-uploader");
element.addEventListener("change", readURL);

function readURL(event) {
	const input = event.target;
	if (input.files && input.files[0]) {
	  var reader = new FileReader();
	  //  alert("ftype");
	  reader.onload = function (e) {
		
		$('#clientimageupdate').attr('src', e.target.result).width(100).height(100);
	  };
	  reader.readAsDataURL(input.files[0]);
	}
  }