<?php
require ('connect.inc.php');

/*
POST-Daten
    coords (array)
        lat,lng|lat,lng|lat,lng
    name
    beschreibung
    typ
*/

/*  Empfangene Daten vorbereiten    */
$coords=explode("|",$_POST['coords']);

function convert($str){
    $str=str_replace('ä','&auml;',$str);
    $str=str_replace('ö','&ouml;',$str);
    $str=str_replace('ü','&uuml;',$str);
    $str=str_replace('Ü','&Uuml;',$str);
    $str=str_replace('Ö','&Ouml;',$str);
    $str=str_replace('Ä','&Auml;',$str);
    $str=str_replace('ß','&szlig;',$str);
    return $str;
}

/*  Luecken aus uebergebenem Array loeschen    */
$i=1;
foreach($coords as $c){
    if($c==''){
        unset($coords[$i-1]);
        continue;
    }
    $i++;
}
/*  Daten in die DB eintragen   */
$fehler=0;
$name=convert($_POST['name']);
$beschreibung=convert($_POST['beschreibung']);
$sql="insert into " . POLY_TABLE . " (name,tstamp,beschreibung,typ) values('$name','" . time() . "','$beschreibung'," . $_POST['typ'] . ")";
$res=mysql_query($sql);
$num=mysql_affected_rows();
if($num>0){
    $sql_getID="select uid from " . POLY_TABLE . " order by uid desc limit 1";
    $res_getID=mysql_query($sql_getID);
    $num_getID=mysql_num_rows($res_getID);
    if($num_getID>0){
        $ID=mysql_result($res_getID,0,'uid');
        for($i=0;$i<count($coords);$i++){
            $data=explode(",",$coords[$i]);
            $klammern=array('(',')');
            $data=str_replace($klammern,"",$data);
            $sql_coords="insert into " . COORDS_TABLE . " (polyID,reihenfolge,y,x) values($ID,$i,'$data[0]','$data[1]')";
            $res_coords=mysql_query($sql_coords);
            $num_coords=mysql_affected_rows();
            if($num_coords==0){
                $fehler=3;
            }
        }
    }
    else{
        $fehler=2;
    }
}
else{
    echo $sql;
    $fehler=1;
}


/*  Erfolg / Fehlermeldung ausgeben */
if($fehler!=0){
    $meldung='Es ist ein Fehler aufgetreten!<br />Fehlercode: ' . $fehler;
    $class='r';
}
else{
    $meldung='Erfolgreich gespeichert!';
    $class='g';
}
$return = array(
    'class' => $class,
    'msg' => $meldung
    );
echo json_encode($return);
?>