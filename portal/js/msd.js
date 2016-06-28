var noOfColumns;
var GridsPerColumns;

function createPage(){
	//Get the top level folder
	var myurl = "/direct/content/resources/group/" + this_site_id + "/Home page.json?depth=3";	//Direct call to My Workspace top level folder
	$.ajax({
		url: myurl,
		dataType: 'json',
		cache: false,
		success: function(data, status, jqXHR) {
			//Call to user's workspace resources was successful, so display top level in tree
    		var output = "";
    		var home_page_index = 0;
    		if(data.content_collection[0].resourceChildren.length == 0) {	//If top level folder is empty
				output += 'Empty';
				$('#msd_portal').html(output);
			 	}
			else{
				//count number of columns called *column*
				noOfColumns = 0;
				$.each(data.content_collection[0].resourceChildren, function(k,val) {
					var objectName = val["name"];
					if(objectName.toLowerCase().indexOf('column') != -1){
						noOfColumns++;
						}
					else{
						if(objectName.toLowerCase().indexOf('image') != -1){
							//find an image in the child of this folder?
							if(val["resourceChildren"].length>0 && val["resourceChildren"][0]['type']=='org.sakaiproject.content.types.fileUpload'){
								var description = "";
								if(val["resourceChildren"][0]['description'] !="" && val["resourceChildren"][0]['description'] !=null){
									description = val["resourceChildren"][0]['description'];
									}
								$('#msd_banner_image').append('<img class="img-responsive" src="'+val["resourceChildren"][0]['url']+'"/><div class="caption"><div class="caption-text"><p class="caption-text-content">'+description+'</p></div></div>');
								}
							}	
						}
					});
				}
			//noOfColumns = data.content_collection[0].resourceChildren.length;
			gridsPerColumn = Math.round(12/noOfColumns);
			var childOfColumn = false;
			output = traverseFolder(data.content_collection[0],childOfColumn);
			$('#msd_portal').html(output);
			}
		});
	}

function traverseFolder(jsonObj, childOfColumn) {
	var output="";
    if(jsonObj["resourceChildren"].length>0) {
        $.each(jsonObj["resourceChildren"], function(k,val) {
        	var objectName = val["name"];
        	if(objectName.toLowerCase().indexOf('image') != -1 && childOfColumn==true){
				//we're an image in a column
				if(val["resourceChildren"].length>0 && val["resourceChildren"][0]['type']=='org.sakaiproject.content.types.fileUpload'){
					var description = "";
					if(val["resourceChildren"][0]['description'] !="" && val["resourceChildren"][0]['description'] !=null){
						description = val["resourceChildren"][0]['description'];
						}
					output += '<div class="row"><div class="col-sm-12"><img class="img-responsive column-image" src="'+val["resourceChildren"][0]['url']+'"><div class="caption"><div class="caption-text"><p class="caption-text-content">'+description+'</p></div></div></div></div>';
					}
            	}
        	else if(childOfColumn==true){
        		output += '<h3>'+val["name"]+'</h3>'; //heading
        		output += '<ul class="menuitems">';
        		childOfColumn = false;
        		output += traverseFolder(val, childOfColumn);
        		childOfColumn = true;
        		output += '</ul>';
        		}
            else if(objectName.toLowerCase().indexOf('column') != -1){
				output += '<div class="col-sm-'+gridsPerColumn+'">';  //top level column definition folders
				childOfColumn = true; //headings will be in next level below this
				output += traverseFolder(val, childOfColumn);
				childOfColumn = false;
				output += '</div>';
            	}
            else if(objectName.toLowerCase().indexOf('image') == -1){ //link
            	var target="_top"; //default
				var indented=false;
				//Look for _frame in the description - expect _frame_###_ where ### is the height in pixels
				if(val.description && val.description.indexOf('_frame') !== -1){
					var heightStart = val.description.indexOf('_frame') + 7;
					var heightEnd = val.description.indexOf('_', heightStart);
					var height = parseInt(val.description.substring(heightStart, heightEnd))
					output += '<iframe src="' + val["url"] + '" title="'+val["name"]+'" style="height:' + height + 'px; width: 100%; border: none;">Your browser does not support frames</iframe>';
				}
            	else {
					if(val["url"].indexOf('__weblearn') == -1){
						target="_blank"; //external link so _blank
						}
					else{
						if(val.description && val["description"].indexOf('_top') == -1){
							target="_self"; //no '_top' in description so open in _self	
							}
						if(val.description && val["description"].indexOf('_indented') != -1){
							indented=true; //_indented in description so apply class to li a below
							}
						}
					if(indented){
						output += '<li><a class="indented" target="'+target+'" href="'+val["url"]+'">'+val["name"]+'</a></li>';
						}
					else{
						output += '<li><a target="'+target+'" href="'+val["url"]+'">'+val["name"]+'</a></li>';
						}
				}
            });
    	}
    else {
        // jsonOb is a number or string
    	}
    return output;
}
