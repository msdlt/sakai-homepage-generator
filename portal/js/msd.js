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
				output += 'There\'s nothing here, but you can <a style="text-decoration: underline;" href="javascript: load_upload_overlay(\'' + data.content_collection[0].url + '\');">upload a file</a> or <a style="text-decoration: underline;" href="javascript: load_folder_overlay(\'' + data.content_collection[0].url + '\');">create a folder</a>.';
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
								$('#msd_banner_image').append('<img class="img-responsive" src="'+val["resourceChildren"][0]['url']+'"></img>');
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
					output += '<img class="img-responsive column-image" src="'+val["resourceChildren"][0]['url']+'"></img>';
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
            	if(val["url"].indexOf('__weblearn') == -1){
					target="_blank"; //external link so _blank
            		}
            	else{
					if(val["description"].indexOf('_top') == -1){
						target="_self"; //no '_top' in description so open in _self	
						}
					}
            	output += '<li><a target="'+target+'" href="'+val["url"]+'">'+val["name"]+'</a></li>';
            	}
            });
    	}
    else {
        // jsonOb is a number or string
    	}
    return output;
}