<?php
require ('connect.inc.php');

$sql = "select * from " . POLY_TABLE ;
$res = mysql_query($sql);
$num = mysql_num_rows($res);

for ($i=0; $i < $num; $i++) { 
    $uid = mysql_result($res, $i, 'uid');
    $name = mysql_result($res, $i, 'name');
    $beschreibung = mysql_result($res, $i, 'beschreibung');
    $typ = mysql_result($res, $i, 'typ');
    $tstamp = mysql_result($res, $i, 'tstamp');
    $datum = date("d.m.Y",$tstamp);
    $uhrzeit = date("H:i",$tstamp);
    $typ_string = ($typ == 1) ? 'Baugrundstück' : 'Gewerbegrundstück';
    echo '<div class="panel-element" data-id="' . $uid . '">';
    echo '<span class="poly-typ label label-info">' . $typ_string . '</span>';
    echo '<span class="poly-name">' . $name . '</span>';
    echo '<span class="poly-beschreibung sr-only">' . $beschreibung . '</span>';
    echo '<span class="poly-datetime">' . $datum . ' ' . $uhrzeit . ' Uhr</span>';
    echo '</div>';
}
?>