<?php
require ('connect.inc.php');

$id = mysql_real_escape_string($_GET['id']);

$sql = "delete from " . POLY_TABLE . " where uid=$id";
$res = mysql_query($sql);
$num = mysql_affected_rows();

if($num>0){

    $sql = "delete from " . COORDS_TABLE . " where polyID=$id";
    $res = mysql_query($sql);
    $num = mysql_affected_rows();
    if($num>0){
        echo 'success';
    }
}
else{
    echo 'error<br />' . $sql;
}
?>