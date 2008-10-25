<?php

$dir = '/home/kfd/public_html/adocsrobo/files/';
$fc = file_get_contents($dir.'administrationinterfaceintroduction.html');

#echo $fc;

echo "\n----------------------------------------";
echo "\n----------------------------------------";
echo "\n----------------------------------------";
echo "\n----------------------------------------";
echo "\n\n";

$fc= preg_replace('/\[\[image:(.*)\]\]/u','<img src="appclib/$1">',$fc);

echo $fc;
?>
