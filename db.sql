#
# Table structure for table 'coords'
#
CREATE TABLE coords (
  uid int(11) NOT NULL auto_increment,
  pid int(11) DEFAULT '0' NOT NULL,
  tstamp int(11) DEFAULT '0' NOT NULL,
  crdate int(11) DEFAULT '0' NOT NULL,
  cruser_id int(11) DEFAULT '0' NOT NULL,
  sorting int(10) DEFAULT '0' NOT NULL,
  deleted tinyint(4) DEFAULT '0' NOT NULL,
  polyID int(11) NOT NULL,
  reihenfolge int(11) NOT NULL,
  y text NOT NULL,
  x text NOT NULL,
  
  PRIMARY KEY (uid),
  KEY parent (pid)
);



#
# Table structure for table 'polygone'
#
CREATE TABLE polygone (
  uid int(11) NOT NULL auto_increment,
  pid int(11) DEFAULT '0' NOT NULL,
  tstamp int(11) DEFAULT '0' NOT NULL,
  crdate int(11) DEFAULT '0' NOT NULL,
  cruser_id int(11) DEFAULT '0' NOT NULL,
  sorting int(10) DEFAULT '0' NOT NULL,
  deleted tinyint(4) DEFAULT '0' NOT NULL,
  name text NOT NULL,
  beschreibung text NOT NULL,
  typ int(11) NOT NULL,
  
  
  PRIMARY KEY (uid),
  KEY parent (pid)
);