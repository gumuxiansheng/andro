<?php
SessionSet('TEMPLATE','rt_pixel');
//vgaSet('MENU_TYPE','TABLE');
global $MPPages;
$MPPages=array('public_downloads'=>1);

vgfSet('ajaxTM',0);
vgfSet('loglogins',true);
vgfSet('buttons_in_commands',true);

function AppDir($app) {
   $app=trim($app);
   $wp=SQL_OneValue('dir_pub',
      "Select dir_pub
         from applications a
         JOIN webpaths     w ON a.webpath=w.webpath
        WHERE a.application='$app'"
   );
   return trim($wp)."/$app/";
}
function AppDirs($app) {
   if($app=='andro') {
      $sq="SELECT dirname FROM appdirs WHERE flag_copy='Y'";
   }
   else {
      $sq="SELECT dirname FROM appdirs 
            WHERE flag_copy='Y' and flag_lib='N'";
   }
   return array_Keys(SQL_allRows($sq,'dirname'));
}
function LatestAndro() {
   $dir = $GLOBALS['AG']['dirs']['root'].'/pkg-apps/';
   $files=scandir($dir);
   $maxtime=0;
   $maxfile='';
   foreach($files as $file) {
      // Only Andromeda non-install files please
      if(strpos($file,'andro')  ===false)  continue;
      if(strpos($file,'install')!==false)  continue;
      if(substr($file,-4)       !='.tgz' ) continue;
      
      // If later than current, save it as our candidate
      if(filemtime($dir.$file)>$maxtime) {
         $maxtime=filemtime($dir.$file);
         $maxfile=$file;
      }
   }
   
   return $maxfile;
}
function hLinkBuild($app,$caption) {
   return hLinkPopup(
      ''
      ,$caption
      ,array(
         "gp_page"=>"a_builder"
         ,"gp_out"=>"none"
         ,'txt_application'=>$app
      )
   );
}

function ExtractTGZ($filespec,$dir) {
   chdir($dir);
   require_once "Archive/Tar.php";
   $tar = new Archive_Tar($filespec,'gz');
   $tar->extract($dir);
}
function sourceDeprecated() {
    ?>
    <div style="border: 3px solid #FF0700; padding: 5px; margin: 10px; 
    background-color: #FFFF00; font-weight: bolder">
    This feature has been deprecated and will be removed from Andromeda
    soon.<br/><br/>  We are now using Subversion (SVN) for Andromeda
    itself and we urge you to setup Subversion for your own applications.
    Subversion is much more powerful than Andromeda's source control
    operations, and it is well worth setting up.
    </div>
    <?php
}
/**
 * Pull all apps out of the server and then examine
 * the local station for latest versions
 *
 */
function svnVersions() {
    // Get a list of applications
    $sq="SELECT application,description
               ,svn_url
               ,'  ' as local
           FROM applications
          ORDER by application";
    $rows = SQL_Allrows($sq,'application');
    
    // Get latest pkg-apps entries
    $dir=$GLOBALS['AG']['dirs']['root'].'pkg-apps/';
    if(!file_exists($dir)) {
        mkdir($dir);
    }
    
    $vdirs=scandir($dir);
    foreach($vdirs as $vdir) {
        if($vdir=='.') continue;
        if($vdir=='..') continue;
        if(strpos($vdir,'-VER-')===false) continue;
        
        // split into app and version
        list($app,$vers) = explode('-VER-',$vdir);
        $rows[$app]['local']=max($rows[$app]['local'],$vers);
    }
    return $rows;
} 

?>
