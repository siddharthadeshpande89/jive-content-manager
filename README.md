Content Manager App:
Jive app (based on node.js jive-sdk) for managing the bulk content.
This app features:
1. Moving content
2. Deleting in bulk
3. Applying tags
4. Categorising with Categories

Primary Tech Stack:
Node.js(server side scripting), jquery, jquery-ui, bootstrap, mustache templates, lodash, Ramda.


Getting started with Jive node sdk Please refer Jive's official document at https://community.jivesoftware.com/docs/DOC-114053

Steps to install Content Manager App:
 Assuming you ave gone through the above documentation from Jive

Checkout the code
put your node.js jive-sdk server's url in jiveclientconfiguration.json
run command "npm update" to download all the dependencies of this app.
Run command "node app" which will start the server and also generate an extension.zip
Upload the extension.zip to you Jive instance as mentioned in this offical jive document.

What is jiveclientconfiguration.json?

Generate new uuid using
var jive  =require('jive-sdk');
jive.util.guid()


Please note that you will need to add jiveServiceSignature in jiveclientconfiguration.json (which can be generated for given uuid
from jive add on console by Command + Right click on upload package button

example of jiveclientconfiguration

{
    "clientUrl": "url of local machine which is accessible by jive uat",
    "port": "port of local machine",
    "logLevel" : "DEBUG",
    "extensionInfo" : {
        "uuid": "cc764e3e-8411-427b-9243-ec9bfc7d9eaf",
        "jiveServiceSignature": "generated as per above doc for this uuid",
        "name" : "local Admin Essentials"
    }
}

Code Structure:
+apps
-->content_manager
  -->public
    --> Javascript
      --> apps
        -> contentManager.js  - Parent class
        -> categoryManager.js - Manages the category's implementation
        -> deleteContent.js - Content Deletion
        -> moveContent.js - Moving the content
        -> tagManager.js - Applying Tags
     -->helpers
        -> jiveWrapper.js - wrapper over Jive apis
        -> validator.js - validator class
        -> view.js - view handler
+services
-->root
  -->backend
    -->routes (end points)
      -> explicit_routes.js
      -> update_categories_tags.js

+ group.js, content.js - Server side helper classes

How to Use the app:
1. Select the content to be updated
2. Select the operation from the operation options
3. Confirm the operation
4. See the logs

Please read more on the same app: