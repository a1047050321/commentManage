<?php
/**
 * @ DB_Mysql.class.php
 */

defined('IN_APP') or exit('Denied Access!');

class DB_Mysql implements DBInterface {

	private static $instanceObj;
	private $config = array();

	private $conn = null;
	private $conn1 = null;
	private $conn2 = null;

	private function __construct($config) {
		$this->config = $config;
		$this->connect();
	}

	public static function instance($config) {
		if (!self::$instanceObj) {
			$c = __CLASS__;
			self::$instanceObj = new $c($config);
		}
		return self::$instanceObj;
	}

	public function connect() {
		if (!$this->conn1 = @mysql_connect($this->config['db_host_ilog'], $this->config['db_user'], $this->config['db_password'])) $this->halt('链接数据库失败!');
		if (!$this->conn2 = @mysql_connect($this->config['db_host_iusm'], $this->config['db_user'], $this->config['db_password'])) $this->halt('链接数据库失败!');
		$this->conn = $this->conn1;
		mysql_select_db($this->config['db_name_ilog'], $this->conn);
		mysql_query("SET NAMES 'utf8'",$this->conn1);
		mysql_query("SET NAMES 'utf8'",$this->conn2);
	}

	public function query($sql) {
		return mysql_query($sql,$this->conn);
	}

	public function select($sql, $num=0, $mode=1) {
		if ($num) $sql .= " LIMIT {$num}";
		$query = $this->query($sql);
		$rs = $result = array();
		while ($result = mysql_fetch_array($query, $mode)) {
			$rs[] = $result;
		}
		return $rs;
	}

	public function get($sql, $mode=1) {
		$rs = $this->select($sql, 1, $mode);
		return isset($rs[0])? $rs[0] : false;
	}

	public function getInsertId() {
		return mysql_insert_id();
	}

	public function changeDB($dbName = 0){
		switch ($dbName) {
			case 0:
				$this->conn = $this->conn1;
				mysql_select_db($this->config['db_name_ilog'], $this->conn);			//连接主要的评论数据库
				break;
			case 1:
				$this->conn = $this->conn2;
				mysql_select_db($this->config['db_name_iusm'], $this->conn);		//连接用户信息数据库
				break;
			default:															//可以往后扩展，连接多个数据库
				break;
		}		
	}
	private function halt($msg, $exit=true) {
		if ($exit) {
			exit('<p>' . $msg . '</p>');
		} else {
			echo '<p>' . $msg . '</p>';
		}
	}

}