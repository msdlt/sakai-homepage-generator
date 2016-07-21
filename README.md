# sakai-homepage-generator
Client-side script to generate MSD-style Sakai (WebLearn at Oxford) homepages from a 'Homepage' directory structure in Resources

![Homepage generator screenshot](/AutoHome.png)

## Install
Copy into root of **Resources** folder:
* Portal folder containing this code
* Index.html

## Configure
In msd_config.js, change:
  ```
  var this_site_id = "1e22f33c-4567-8a9d-a0d1-2a3bdd4d5ab6";  //Update this with your site's ID
  ```
## Create folder structure
* **Home page** top-level directory to contain strucure
* Under this add columns - folders called **Column 1**, **Column 2**, etc. Note you you can only have a number which is a divisor of 12 ie 12, 6, 4, 3, or 2.
* Under each column, add folders:
  * A **My heading name** folder will create a `<h3>My heading name</h3>` in that column
    * Web links within this folder will be converted to `<li><a href="url" target="_self">Test resources folder</a></li>`. If:
      * url is a an external (non-WebLearn) link, `target="_blank"`
      * url is a WebLearn (internal) link, `target="_self"` (i.e. within frameset)
      * url is a WebLearn (internal) link && the description field for the url contains **_top**, `target="_top"`
	  * description field for the url contains **\_frame\_###\_** (where ### is height of frame in pixels), the link will be inserted as a 100% width iframe of the specified height
    * If the description field contains `_indented`, the link will be indented by 15px (`<a class="indented">`)
  * An **Image** folder which contains an image will create a `<img class="img-responsive column-image" src="">` in that column where src= path to the image contained in the folder. If you add a description to your image (**Edit Details**),for e.g atribution, that description (which may include html sich as links) will appear when a user hovers over the image.

