<?php

/**	
*	builder.php is used to satisfy all of the dependencies of AndroBuild.php for use on the command line.  Allows for the building
*	of the andromeda application through the command line, instead of on the web installer.
*/


/*
* Necessary includes (Dependencies for AndroBuild.php)
*/
$force_cli = true;
include("/var/www/andro_root/andro/index.php");
#include("/var/www/andro_root/andro/lib/androLib.php");
#include("/var/www/andro_root/andro/lib/spyc/spyc.php");


/*
* Hardcode depended $GLOBALS
*/
$GLOBALS["parm"] = array(
            "DBSERVER_URL"=>"localhost"
            ,"UID"=>"postgres"
            ,"DIR_PUBLIC"=>"/var/www/andro_root/"
            ,"DIR_PUBLIC_APP"=>"andro"
            ,"APP"=>"andro"
            ,"APPDSC"=>"Andromeda Node Manager"
            ,"SPEC_BOOT"=>"AndroDBB"
            ,"SPEC_LIB"=>"andro_universal"
            ,"SPEC_LIST"=>"andro.dd.yaml"
         );
$GLOBALS["x_password"] = '';
$GLOBALS["AG"]["dirs"]["dyanmic"] = "/var/www/andro_root/andro/dynamic/";
$GLOBALS["AG"]["dirs"]["root"] = "/var/www/andro_root/andro/";
$GLOBALS["AG"]["application"] = "andro";

/*
* Connect to database
*/
connect();

/*
* Build andromeda
*/
include('androInstallBuild.php');

/*
* Insert new webpaths record
*/
$dir_pub= realpath(dirname(__FILE__).'/../..');
if(strpos(ArraySafe($_ENV,'OS',''),'indows')!==false) {
	$dir_pub = str_replace("\\","\\\\",$dir_pub);
}
$row=array(
	'webpath'=>'DEFAULT'
	,'dir_pub'=>$dir_pub
	,'description'=>'Default Web Path'
	);
SQLX_Insert('webpaths',$row);

/*
* Insert new applications record
*/
$row=array(
                  'application'=>'andro'
                  ,'description'=>"Andromeda Node Manager"
                  ,'appspec'=>'andro.dd.yaml'
                  ,'node'=>'LOCAL'
                  ,'webpath'=>'DEFAULT'
		  ,'flag_svn'=>'Y'
	          ,'svn_url'=>'http://andro.svn.sourceforge.net/svnroot/andro/releases/'
               );
SQLX_Insert('applications',$row);

/*
* End - Close connection
*/
disconnect();



//==================================================================
//	FUNCTIONS
//==================================================================

/**
* Connect to the postgresql database server with the default installed username
*/
function connect() {
	$cnx = 
		" dbname=andro".
		" user=start".
		" password=start";
	$GLOBALS["dbconn"] = pg_connect($cnx,PGSQL_CONNECT_FORCE_NEW);
}

/**
* Disconnect from the postgresql database server
*/
function disconnect() {
	pg_close($GLOBALS["dbconn"]);
}

?>
