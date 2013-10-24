<?php
require ('connect.inc.php');

$id = mysql_real_escape_string($_GET['id']);

$sql = "select * from " . COORDS_TABLE . " where polyID=$id order by reihenfolge asc";
$res = mysql_query($sql);
$num = mysql_num_rows($res);

$latlng = array();

for ($i=0; $i < $num; $i++) { 
    $y = floatval( mysql_result($res, $i, 'y') );
    $x = floatval( mysql_result($res, $i, 'x') );
    array_push($latlng, array($y,$x));
}
echo json_encode($latlng);

?>