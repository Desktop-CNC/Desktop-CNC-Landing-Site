# Desktop CNC Website 
Author: Matthew Papesh

## 1.0 Overview 
This project is the main landing page and website for the Desktop CNC organization at WPI-MME. This website supports Desktop CNC documentation and user guide materials. Additionally, this website hosts a G-Code cloud storage service and client-side Universal Gcode Sender (UGS) interaction. UGS can be launched from the client-side when visiting the website if the client computer is configured correctly. Despite this special configuration, all other website resources function without it. 

**The website can be found here: https://desktop-cnc-landing-site.onrender.com**

## 2.0 Configure UGS-Client 
UGS-Client setup is used to allow your computer to listen to the website for when the UGS launch is triggered bu the home page launch button. This can be configured by simply running the `RaspPiServer.js` server on your client. This client-side server will listen to the website for a launch signal, and it will launch UGS accordingly.

If you wish to not manually run the client-side server everytime you boot up your computer, `RaspPiServer.js` can be run by running `init_main_client.sh`. This shell script can be added to your computer's programs to run at start-up. On Linux, this can be done by calling the initializer shell script from the `~/.profile` file. 

Without the client-side server running, UGS will not be able to boot up since the website never actually has access to your computer. (For security reasons)
Additionally, the `https://github.com/Desktop-CNC/Desktop-CNC-Universal-G-Code-Sender` repository must be cloned to `~/Documents/GitHub` for UGS to be found. **Most clients do not need this functionality. But for those that do, this repository must be clone and the initializer script must be called.**

## 3.0 Website Documentation 
Documentation is stored in the Desktop CNC WebDocumentation repository [here](https://github.com/Desktop-CNC/Desktop-CNC-WebDocumentation).

User guides and other documentation is rendered from the WebDocumentation repository. This is so that docs can easily be maintained separate of the website.


