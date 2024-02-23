const uploaderElements = document.querySelectorAll(".posttype-industry-uploader");
uploaderElements.forEach(element => {
	element.addEventListener("change", readURL)
})

const editElement = document.querySelector("#posttype-industry-post-edit");
editElement.addEventListener("click", industriesPost_edit);

function industriesPost_edit(event){
	const editid = event.target.dataset.identifier;
	// alert(editid);
	  $.ajax({
	  url:"/getIndustriesPost/"+editid,
	  method:"GET",
	  success: function(response){
		// alert(response);
		  $('#editid').val(editid);
		  $('#meta_title').val(response.meta_title);
		  $('#meta_desc').val(response.meta_desc);
		  $('#meta_keywords').val(response.meta_keywords);
		  $('#title').val(response.title);
		  $('#banner_title').val(response.banner_title);
		  $('#banner_desc').val(response.banner_desc);
		  $('#view_project_url').val(response.view_project_url);
		  $('#content').html(response.content);
		  content.setData(response.content);
		  $('#brand_title').val(response.brand_title);
		  $('#brand_heading').val(response.brand_heading);
		  $('#our_technology_title').val(response.our_technology_title);
		  $('#ask_us_title').val(response.ask_us_title);
		  $('#ask_us_heading').val(response.ask_us_heading);
		  $('#project_video_update').val(response.project_video_name);
  
		  $('#dimension_title_one').val(response.dimension_title_one);
		  $('#dimension_title_two').val(response.dimension_title_two);
		  $('#dimension_title_three').val(response.dimension_title_three);
		  $('#dimension_title_four').val(response.dimension_title_four);
		  $('#dimension_title_five').val(response.dimension_title_five);
		  $('#dimension_title_six').val(response.dimension_title_six);
		  $('#dimension_title_seven').val(response.dimension_title_seven);
		  $('#dimension_title_eight').val(response.dimension_title_eight);
		  
		  $('#industries_title').val(response.industries_title);
		  $('#industries_title_one').val(response.industries_title_one);
		  $('#industries_title_two').val(response.industries_title_two);
		  $('#industries_title_three').val(response.industries_title_three);
		  $('#industries_title_four').val(response.industries_title_four);
		  $('#industries_title_five').val(response.industries_title_five);
		  $('#industries_title_six').val(response.industries_title_six);
		  $('#industries_title_seven').val(response.industries_title_seven);
		  $('#industries_title_eight').val(response.industries_title_eight);
  
		  $('#toolkit_title_one').val(response.toolkit_title_one);
		  $('#toolkit_title_two').val(response.toolkit_title_two);
		  $('#toolkit_title_three').val(response.toolkit_title_three);
  
		  $('#language_title_one').val(response.language_title_one);
		  $('#language_title_two').val(response.language_title_two);
		  $('#language_title_three').val(response.language_title_three);
  
		  $('#ask_us_bg_text').val(response.ask_us_bg_text);
  
		  $('#sdk_title_one').val(response.sdk_title_one);
		  $('#sdk_title_two').val(response.sdk_title_two);
		  $('#sdk_title_three').val(response.sdk_title_three);
  
  
		  $('#pre_banner_main_image').val(response.banner_main_image_name);
		  if(response.banner_main_image_name != ''){
			$('#banner_main_image_update').attr('src', '<%= frontend_url %>'+response.banner_main_image_name).width(100).height(100); 
		  }
		  $('#pre_banner_second_image').val(response.banner_second_image_name);
		  if(response.banner_second_image_name != ''){
			$('#banner_second_image_update').attr('src', '<%= frontend_url %>'+response.banner_second_image_name).width(100).height(100); 
		  }
		  $('#pre_our_technology_image').val(response.our_technology_image_name);
		  if(response.our_technology_image_name != ''){
			$('#our_technology_image_update').attr('src', '<%= frontend_url %>'+response.our_technology_image_name).width(100).height(100); 
		  }
  
		  $('#pre_brand_image_one').val(response.brand_image_one_name);
		  if(response.brand_image_one_name != ''){
			$('#brand_image_one_update').attr('src', '<%= frontend_url %>'+response.brand_image_one_name).width(100).height(100); 
		  }
		  $('#pre_brand_image_two').val(response.brand_image_two_name);
		  if(response.brand_image_two_name != ''){
			$('#brand_image_two_update').attr('src', '<%= frontend_url %>'+response.brand_image_two_name).width(100).height(100); 
		  }
		  $('#pre_brand_image_three').val(response.brand_image_three_name);
		  if(response.brand_image_three_name != ''){
			$('#brand_image_three_update').attr('src', '<%= frontend_url %>'+response.brand_image_three_name).width(100).height(100); 
		  }
  
		  $('#pre_toolkit_image_one').val(response.toolkit_image_one_name);
		  if(response.toolkit_image_one_name != ''){
			$('#toolkit_image_one_update').attr('src', '<%= frontend_url %>'+response.toolkit_image_one_name).width(100).height(100); 
		  }
		  $('#pre_toolkit_image_two').val(response.toolkit_image_two_name);
		  if(response.toolkit_image_two_name != ''){
			$('#toolkit_image_two_update').attr('src', '<%= frontend_url %>'+response.toolkit_image_two_name).width(100).height(100); 
		  }
		  $('#pre_toolkit_image_three').val(response.toolkit_image_three_name);
		  if(response.toolkit_image_three_name != ''){
			$('#toolkit_image_three_update').attr('src', '<%= frontend_url %>'+response.toolkit_image_three_name).width(100).height(100); 
		  }
  
		  $('#pre_language_image_one').val(response.language_image_one_name);
		  if(response.language_image_one_name != ''){
			$('#language_image_one_update').attr('src', '<%= frontend_url %>'+response.language_image_one_name).width(100).height(100); 
		  }
		  $('#pre_language_image_two').val(response.language_image_two_name);
		  if(response.language_image_two_name != ''){
			$('#language_image_two_update').attr('src', '<%= frontend_url %>'+response.language_image_two_name).width(100).height(100); 
		  }
		  $('#pre_language_image_three').val(response.language_image_three_name);
		  if(response.language_image_three_name != ''){
			$('#language_image_three_update').attr('src', '<%= frontend_url %>'+response.language_image_three_name).width(100).height(100); 
		  }
  
		  $('#pre_sdk_image_one').val(response.sdk_image_one_name);
		  if(response.sdk_image_one_name != ''){
			$('#sdk_image_one_update').attr('src', '<%= frontend_url %>'+response.sdk_image_one_name).width(100).height(100); 
		  }
		  $('#pre_sdk_image_two').val(response.sdk_image_two_name);
		  if(response.sdk_image_two_name != ''){
			$('#sdk_image_two_update').attr('src', '<%= frontend_url %>'+response.sdk_image_two_name).width(100).height(100); 
		  }
		  $('#pre_sdk_image_three').val(response.sdk_image_three_name);
		  if(response.sdk_image_three_name != ''){
			$('#sdk_image_three_update').attr('src', '<%= frontend_url %>'+response.sdk_image_three_name).width(100).height(100); 
		  }
  
		  $('#pre_dimension_image_one').val(response.dimension_image_one_name);
		  if(response.dimension_image_one_name != ''){
			$('#dimension_image_one_update').attr('src', '<%= frontend_url %>'+response.dimension_image_one_name).width(100).height(100); 
		  }
		  $('#pre_dimension_image_two').val(response.dimension_image_two_name);
		  if(response.dimension_image_two_name != ''){
			$('#dimension_image_two_update').attr('src', '<%= frontend_url %>'+response.dimension_image_two_name).width(100).height(100); 
		  }
		  $('#pre_dimension_image_three').val(response.dimension_image_three_name);
		  if(response.dimension_image_three_name != ''){
			$('#dimension_image_three_update').attr('src', '<%= frontend_url %>'+response.dimension_image_three_name).width(100).height(100); 
		  }
		  $('#pre_dimension_image_four').val(response.dimension_image_four_name);
		  if(response.dimension_image_four_name != ''){
			$('#dimension_image_four_update').attr('src', '<%= frontend_url %>'+response.dimension_image_four_name).width(100).height(100); 
		  }
		  $('#pre_dimension_image_five').val(response.dimension_image_five_name);
		  if(response.dimension_image_five_name != ''){
			$('#dimension_image_five_update').attr('src', '<%= frontend_url %>'+response.dimension_image_five_name).width(100).height(100); 
		  }
		  $('#pre_dimension_image_six').val(response.dimension_image_six_name);
		  if(response.dimension_image_six_name != ''){
			$('#dimension_image_six_update').attr('src', '<%= frontend_url %>'+response.dimension_image_six_name).width(100).height(100); 
		  }
		  $('#pre_dimension_image_seven').val(response.dimension_image_seven_name);
		  if(response.dimension_image_seven_name != ''){
			$('#dimension_image_seven_update').attr('src', '<%= frontend_url %>'+response.dimension_image_seven_name).width(100).height(100); 
		  }
		  $('#pre_dimension_image_eight').val(response.dimension_image_eight_name);
		  if(response.dimension_image_eight_name != ''){
			$('#dimension_image_eight_update').attr('src', '<%= frontend_url %>'+response.dimension_image_eight_name).width(100).height(100); 
		  }
  
		  $('#pre_industries_image_one').val(response.industries_image_one_name);
		  if(response.industries_image_one_name != ''){
			$('#industries_image_one_update').attr('src', '<%= frontend_url %>'+response.industries_image_one_name).width(100).height(100); 
		  }
		  $('#pre_industries_image_two').val(response.industries_image_two_name);
		  if(response.industries_image_two_name != ''){
			$('#industries_image_two_update').attr('src', '<%= frontend_url %>'+response.industries_image_two_name).width(100).height(100); 
		  }
		  $('#pre_industries_image_three').val(response.industries_image_three_name);
		  if(response.industries_image_three_name != ''){
			$('#industries_image_three_update').attr('src', '<%= frontend_url %>'+response.industries_image_three_name).width(100).height(100); 
		  }
		  $('#pre_industries_image_four').val(response.industries_image_four_name);
		  if(response.industries_image_four_name != ''){
			$('#industries_image_four_update').attr('src', '<%= frontend_url %>'+response.industries_image_four_name).width(100).height(100); 
		  }
		  $('#pre_industries_image_five').val(response.industries_image_five_name);
		  if(response.industries_image_five_name != ''){
			$('#industries_image_five_update').attr('src', '<%= frontend_url %>'+response.industries_image_five_name).width(100).height(100); 
		  }
		  $('#pre_industries_image_six').val(response.industries_image_six_name);
		  if(response.industries_image_six_name != ''){
			$('#industries_image_six_update').attr('src', '<%= frontend_url %>'+response.industries_image_six_name).width(100).height(100); 
		  }
		  $('#pre_industries_image_seven').val(response.industries_image_seven_name);
		  if(response.industries_image_seven_name != ''){
			$('#industries_image_seven_update').attr('src', '<%= frontend_url %>'+response.industries_image_seven_name).width(100).height(100); 
		  }
		  $('#pre_industries_image_eight').val(response.industries_image_eight_name);
		  if(response.industries_image_eight_name != ''){
			$('#industries_image_eight_update').attr('src', '<%= frontend_url %>'+response.industries_image_eight_name).width(100).height(100); 
		  }
  
		  $('#pre_ask_us_image').val(response.ask_us_image_name);
		  if(response.ask_us_image_name != ''){
			$('#ask_us_image_update').attr('src', '<%= frontend_url %>'+response.ask_us_image_name).width(100).height(100); 
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