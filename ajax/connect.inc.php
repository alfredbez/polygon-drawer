<?php
header("Content-Type: text/html; charset=utf-8");
/*  MySQL Verbindung aufbauen   */
$mysqlhost="localhost";
$mysqluser="root";
$mysqlpwd="";
$connection=mysql_connect($mysqlhost, $mysqluser, $mysqlpwd) or die ("Verbindungsversuch fehlgeschlagen");
$mysqldb="polygon_drawer";
mysql_select_db($mysqldb, $connection) or die("Konnte die Datenbank nicht waehlen.");
mysql_query('set names utf8');

define('POLY_TABLE','polygone');
define('COORDS_TABLE','coords');
?>