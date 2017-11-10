<?php
/**
 * @ controller Index.class.php
 */

defined('IN_APP') or exit('Denied Access!');

date_default_timezone_set('prc');

class IndexController extends Controller {
	/**
	 * 删除驳回信息
	 */
	public function deleteComment() {
		if (!isset($_POST['accesstoken'])) {
			$this->sendByAjax(array('ret'=>1,'ret_msg'=>'没有的操作token！'));
		} else {
			$cid = isset($_REQUEST['commentid']) ? trim($_REQUEST['commentid']) : 0;
			$rex = '/^[0-9]+$/';
			if(preg_match($rex,$cid)){
				$cid = strval($cid);
			}else{
				$this->sendByAjax(array('ret'=>2,'ret_msg'=>'无效评论id！'));
			}
			$content = $this->db->get("SELECT f_comment_id FROM `t_user_rejected` WHERE `f_comment_id`={$cid}");
			if ($content){
				$this->db->query("DELETE FROM `t_user_rejected` WHERE `f_comment_id`={$cid}");
				$this->sendByAjax(array('ret'=>0,'ret_msg'=>'success'));
			}else{
				$content = $this->db->get("SELECT comment_id FROM `user_short_comment` WHERE `comment_id`={$cid}");
				if($content){
					$this->db->query("DELETE FROM `user_short_comment` WHERE `comment_id`={$cid}");
					$this->sendByAjax(array('ret'=>0,'ret_msg'=>'success'));
				}else{
					$this->sendByAjax(array('ret'=>3,'ret_msg'=>'不存在的评论id！'));
				}
			} 			
		}
	}

	/**
	 * 获取评论信息
	 */
	public function getinfo() {
		if (!isset($_POST['accesstoken'])) {
			$this->sendByAjax(array('ret'=>1,'ret_msg'=>'你还没有登陆！'));
		} else {
			$cid = isset($_REQUEST['commentid']) ? trim($_REQUEST['commentid']) : 0;
			$rex = '/^[0-9]+$/';
			if(preg_match($rex,$cid)){
				$cid = strval($cid);
			}else{
				$this->sendByAjax(array('ret'=>2,'ret_msg'=>'无效评论id！'));
			}
			$content = $this->db->get("SELECT comment_id FROM `user_short_comment` WHERE `comment_id`={$cid}");
			if (!$content)
			{
				$content = $this->db->get("SELECT f_comment_id FROM `t_user_rejected` WHERE `f_comment_id`={$cid}");
				if (!$content){
					 $this->sendByAjax(array('ret'=>3,'ret_msg'=>'不存在的评论id！'));
					}else{
						$result = $this->db->get("SELECT * FROM `t_user_rejected` WHERE `f_comment_id`={$cid}");
						$pid = $result['f_operator_id'];
						$uid = $result['f_user_id'];
						$this->db->changeDB(1);
						if(!empty($pid)){
							$opename = $this->db->get("SELECT operator_name FROM `operator_info` WHERE `operator_id`= '{$pid}'");
							$result['f_operator_name'] = $opename['operator_name'];
						}
						if(!empty($uid)){
							$username = $this->db->get("SELECT nick_name FROM `account_info` WHERE `DA`= '{$uid}'");	
							$result['user_name'] = $username['nick_name'];
						}												
						$this->db->changeDB();
						$this->sendByAjax(array('ret'=>0,'ret_msg'=>'success','commentinfo'=>$result));
					}
			}else{
				$result = $this->db->get("SELECT * FROM `user_short_comment` WHERE `comment_id`={$cid}");
				$pid = $result['f_operator_id'];
				$uid = $result['user_id'];
				$this->db->changeDB(1);
				if(!empty($pid)){
					$opename = $this->db->get("SELECT operator_name FROM `operator_info` WHERE `operator_id`= '{$pid}'");
					$result['f_operator_name'] = $opename['operator_name'];
				}
				if(!empty($uid)){
					$username = $this->db->get("SELECT nick_name FROM `account_info` WHERE `DA`= '{$uid}'");	
					$result['user_name'] = $username['nick_name'];
				}		
				$this->db->changeDB();
				$this->sendByAjax(array('ret'=>0,'ret_msg'=>'success','commentinfo'=>$result,'id'=>$cid));
			}
		}
	}

	/**
	 * @ 评论通过
	 */
	public function passComment() {
		$operid = $_POST['operid'];
		$time  = date("Y-m-d H:i:s",time());
		if (!isset($_POST['accesstoken']) || !isset($operid)) {
			$this->sendByAjax(array('ret'=>1,'ret_msg'=>'没有的操作id或token！'));
		} else {
			$cid = isset($_REQUEST['commentid']) ? trim($_REQUEST['commentid']) : 0;
			$rex = '/^[0-9]+$/';
			if(preg_match($rex,$cid)){
				$cid = strval($cid);
			}else{
				$this->sendByAjax(array('ret'=>2,'ret_msg'=>'无效评论id！'));
			}
			$content = $this->db->get("SELECT comment_id FROM `user_short_comment` WHERE `comment_id`={$cid}");
			if (!$content) $this->sendByAjax(array('ret'=>3,'ret_msg'=>'不存在的评论id！'));
			$this->db->query("UPDATE `user_short_comment` SET `f_status`= 2 WHERE `comment_id`={$cid}");
			$this->db->query("UPDATE `user_short_comment` SET `f_operator_id`= '{$operid}' WHERE `comment_id`={$cid}");
			$this->db->query("UPDATE `user_short_comment` SET `f_operator_time`= '{$time}' WHERE `comment_id`={$cid}");
			$this->sendByAjax(array('ret'=>0,'ret_msg'=>'success'));
		}
	}

	/**
	 * @ 评论人工驳回
	 */
	public function forbidComment() {
		$reason = isset($_REQUEST['reson']) ? $_REQUEST['reson'] : "";

		if (!isset($_POST['accesstoken'])) {
			$this->sendByAjax(array('ret'=>1,'ret_msg'=>'你还没有登陆！'));
		} else {
			$cid = isset($_REQUEST['commentid']) ? trim($_REQUEST['commentid']) : 0;
			$rex = '/^[0-9]+$/';
			if(preg_match($rex,$cid)){
				$cid = strval($cid);
			}else{
				$this->sendByAjax(array('ret'=>2,'ret_msg'=>'无效评论id！'));
			}
			$commentid = $this->db->get("SELECT comment_id FROM `user_short_comment` WHERE `comment_id`={$cid}");
			if (!$commentid){
				$this->sendByAjax(array('ret'=>3,'ret_msg'=>'不存在的评论id！'));
			} 
			$commentinfo = $this->db->get("SELECT * FROM `user_short_comment` WHERE `comment_id`={$cid}");
			$proid = $commentinfo['program_id'];
			$userid = $commentinfo['user_id'];
			$refComid = $commentinfo['ref_comment_id'];
			$proname = $commentinfo['f_program_name'];
			$comtime = $commentinfo['comment_time'];
			$praise = $commentinfo['praise'];
			$commsource = $commentinfo['comment_source'];
			$content = $commentinfo['content'];
			$content = str_replace('\'',' ',$content);
			$content = str_replace('"',' ',$content);
			$content = str_replace('\\',' ',$content);
			$renum = $commentinfo['f_repeat_num'];
			$operid = isset($_REQUEST['operid']) ? intval($_REQUEST['operid']) : "";
			$opertime = date("Y-m-d H:i:s",time());
				
			//添加进rejected表中
			if($this->db->query("INSERT INTO `t_user_rejected` (`f_comment_id`, `f_program_id`, `f_user_id`, `f_content`, `f_comment_time`, `f_ref_comment_id`, `f_comment_source`, `f_operator_id`, `f_operator_time`, `f_reject_desc`, `f_praise_num`,`f_reply_num`,`f_program_name`) VALUES ('{$cid}', '{$proid}', '{$userid}','{$content}','{$comtime}','{$refComid}','{$commsource}','{$operid}','{$opertime}','{$reason}','{$praise}','{$renum}','{$proname}')")){
				//从user表中删除
				$this->db->query("DELETE FROM `user_short_comment` WHERE `comment_id`={$cid}");
				$this->adjustUserRecord($userid,$cid,$proid);
				
			}else{
				$this->sendByAjax(array('ret'=>4,'ret_msg'=>'驳回失败！'));
			}				
				
			
			
		}
	}

	/**
	 * @ 敏感词驳回驳内部使用，不需要给返回
	 */
	
	private function sensitiveForbid1() {
		$reason = "含有敏感词";
		if (!isset($_POST['accesstoken'])) {
			$this->sendByAjax(array('ret'=>1,'ret_msg'=>'你还没有登陆！'));
		} else {
			$result = $this->db->select("SELECT c.comment_id FROM `user_short_comment` as c WHERE f_status = 1 ");
			for( $i = 0,$len = count($result); $i < $len; $i++){
				$cid = $result[$i]['comment_id'];
				$commentinfo = $this->db->get("SELECT * FROM `user_short_comment` WHERE `comment_id`={$cid}");
				$proid = $commentinfo['program_id'];
				$userid = $commentinfo['user_id'];
				$refComid = $commentinfo['ref_comment_id'];
				$proname = $commentinfo['f_program_name'];
				$comtime = $commentinfo['comment_time'];
				$praise = $commentinfo['praise'];
				$commsource = $commentinfo['comment_source'];
				$content = $commentinfo['content'];
				$renum = $commentinfo['f_repeat_num'];
				$operid = isset($_REQUEST['operid']) ? intval($_REQUEST['operid']) : 0;
				$opertime = date("Y-m-d H:i:s",time());
					
				//添加进rejected表中
				if($this->db->query("INSERT INTO `t_user_rejected` (`f_comment_id`, `f_program_id`, `f_user_id`, `f_content`, `f_comment_time`, `f_ref_comment_id`, `f_comment_source`, `f_operator_id`, `f_operator_time`, `f_reject_desc`, `f_praise_num`,`f_reply_num`,`f_program_name`) VALUES ('{$cid}', '{$proid}', '{$userid}','{$content}','{$comtime}','{$refComid}','{$commsource}','{$operid}','{$opertime}','{$reason}','{$praise}','{$renum}','{$proname}')")){
					//从user表中删除
					$this->db->query("DELETE FROM `user_short_comment` WHERE `comment_id`={$cid}");
					
					
				}else{
					$this->sendByAjax(array('ret'=>4,'ret_msg'=>'驳回失败！'));
				}
				
			}
					
		}
		
	}
	/**
	 * @ 敏感词驳回驳外部使用，需要给返回
	 */
	public function sensitiveForbid() {
		$reason = "含有敏感词";
		if (!isset($_POST['accesstoken'])) {
			$this->sendByAjax(array('ret'=>1,'ret_msg'=>'你还没有登陆！'));
		} else {
			$result = $this->db->select("SELECT c.comment_id FROM `user_short_comment` as c WHERE f_status = 1 ");
			for( $i = 0,$len = count($result); $i < $len; $i++){
				$cid = $result[$i]['comment_id'];
				$commentinfo = $this->db->get("SELECT * FROM `user_short_comment` WHERE `comment_id`={$cid}");
				$proid = $commentinfo['program_id'];
				$userid = $commentinfo['user_id'];
				$refComid = $commentinfo['ref_comment_id'];
				$proname = $commentinfo['f_program_name'];
				$comtime = $commentinfo['comment_time'];
				$praise = $commentinfo['praise'];
				$commsource = $commentinfo['comment_source'];
				$content = $commentinfo['content'];
				$renum = $commentinfo['f_repeat_num'];
				$operid = isset($_REQUEST['operid']) ? intval($_REQUEST['operid']) : 0;
				$opertime = date("Y-m-d H:i:s",time());
					
				//添加进rejected表中
				if($this->db->query("INSERT INTO `t_user_rejected` (`f_comment_id`, `f_program_id`, `f_user_id`, `f_content`, `f_comment_time`, `f_ref_comment_id`, `f_comment_source`, `f_operator_id`, `f_operator_time`, `f_reject_desc`, `f_praise_num`,`f_reply_num`,`f_program_name`) VALUES ('{$cid}', '{$proid}', '{$userid}','{$content}','{$comtime}','{$refComid}','{$commsource}','{$operid}','{$opertime}','{$reason}','{$praise}','{$renum}','{$proname}')")){
					//从user表中删除
					$this->db->query("DELETE FROM `user_short_comment` WHERE `comment_id`={$cid}");
									
				}else{
					$this->sendByAjax(array('ret'=>4,'ret_msg'=>'驳回失败！'));
				}
				
			}
			$this->sendByAjax(array('ret'=>0,'ret_msg'=>'success！'));	
					
		}
		
	}
	/**
	 * @ 获取评论列表
	 */
	public function getList() {
		$page = isset($_REQUEST['pageidx']) ? intval($_REQUEST['pageidx']) : 1;	//当前页数
		$n = isset($_REQUEST['pagenum']) ? intval($_REQUEST['pagenum']) : 50;	//每页显示条数
		$list = isset($_REQUEST['displayList']) ? $_REQUEST['displayList'] : "";		//获取不同的显示列表包含(终端提交、已发布、已驳回)
		$onOff = isset($_REQUEST['peoplereview']) ? intval($_REQUEST['peoplereview']) : 0; //敏感词审核不通过是否需要人工审核
		$filter = isset($_REQUEST['filter']) ? intval($_REQUEST['filter']) : 0; //条件筛选(敏感词通过、未通过、全部 & 人工驳回、敏感词驳回、全部)
		
		$result_count = null;			//获取的总记录数
		$start = ( $page - 1 ) * $n;

		if($onOff == 1){
			if($list == "comment"){
				if($filter == 0){
					$result_count = $this->db->get("SELECT count('comment_id') as count FROM `user_short_comment` WHERE f_status != 2");
					// $total = $result_count['count'] ? (int) $result_count['count'] : 0;
					// $max_num = floor($total / $n);
					// $page = rand(0,$max_num);
					// $start = $page * $n;
					$result = $this->db->select("SELECT c.comment_id,c.user_id,c.comment_time,c.f_status,c.content,c.f_sensitive_content FROM `user_short_comment` as c WHERE f_status != 2 ORDER BY c.comment_time DESC LIMIT {$start},{$n}");
				}else if($filter == 1){
					$result_count = $this->db->get("SELECT count('comment_id') as count FROM `user_short_comment` WHERE f_status = 0");
					// $total = $result_count['count'] ? (int) $result_count['count'] : 0;
					// $max_num = floor($total / $n);
					// $page = rand(0,$max_num);
					// $start = $page * $n;
					$result = $this->db->select("SELECT c.comment_id,c.user_id,c.comment_time,c.f_status,c.content,c.f_sensitive_content FROM `user_short_comment` as c WHERE f_status = 0  ORDER BY c.comment_time DESC LIMIT {$start},{$n}");
				}else if($filter == 2){
					$result_count = $this->db->get("SELECT count('comment_id') as count FROM `user_short_comment` WHERE f_status = 1");
					// $total = $result_count['count'] ? (int) $result_count['count'] : 0;
					// $max_num = floor($total / $n);
					// $page = rand(0,$max_num);
					// $start = $page * $n;
					$result = $this->db->select("SELECT c.comment_id,c.user_id,c.comment_time,c.f_status,c.content,c.f_sensitive_content FROM `user_short_comment` as c WHERE f_status = 1  ORDER BY c.comment_time DESC LIMIT {$start},{$n}");
				}
				
			}else if($list == "public"){
				$result_count = $this->db->get("SELECT count('comment_id') as count FROM `user_short_comment` WHERE f_status = 2 ");
				$result = $this->db->select("SELECT c.comment_id,c.program_id,c.user_id,c.praise,c.f_operator_id,c.f_operator_time,c.comment_time,c.content FROM `user_short_comment` as c WHERE f_status = 2  ORDER BY c.f_operator_time DESC LIMIT {$start},{$n}");
			}else if($list == "forbid"){
				if($filter == 0){
					
					$result_count = $this->db->get("SELECT count('f_comment_id') as count FROM `t_user_rejected` ");					
					$result = $this->db->select("SELECT c.f_comment_id,c.f_program_id,c.f_user_id,c.f_reject_desc,c.f_operator_id,c.f_operator_time FROM `t_user_rejected` as c ORDER BY c.f_operator_time DESC LIMIT {$start},{$n}");
				}else if($filter == 1){
					$result_count = $this->db->get("SELECT count('f_comment_id') as count FROM `t_user_rejected` WHERE f_operator_id != 0");
					$result = $this->db->select("SELECT c.f_comment_id,c.f_program_id,c.f_user_id,c.f_reject_desc,c.f_operator_id,c.f_operator_time FROM `t_user_rejected` as c WHERE f_operator_id != 0 ORDER BY c.f_operator_time DESC LIMIT {$start},{$n}");

				}else if($filter == 2){
					
					$result_count = $this->db->get("SELECT count('f_comment_id') as count FROM `t_user_rejected` WHERE f_operator_id = 0");
					$result = $this->db->select("SELECT c.f_comment_id,c.f_program_id,c.f_user_id,c.f_reject_desc,c.f_operator_id,c.f_operator_time FROM `t_user_rejected` as c WHERE f_operator_id = 0 ORDER BY c.f_operator_time DESC LIMIT {$start},{$n}");
				}
			}
		}else{
					
			if($list == "comment"){
				$result_count = $this->db->get("SELECT count('comment_id') as count FROM `user_short_comment` WHERE f_status = 0");
				// $total = $result_count['count'] ? (int) $result_count['count'] : 0;
				// $max_num = floor($total / $n);
				// $page = rand(0,$max_num);
				// $start = $page * $n;
				$result = $this->db->select("SELECT c.comment_id,c.f_sensitive_content,c.user_id,c.comment_time,c.f_status,c.content FROM `user_short_comment` as c WHERE f_status = 0  ORDER BY c.comment_time DESC LIMIT {$start},{$n}");
			}else if($list == "public"){
				$result_count = $this->db->get("SELECT count('comment_id') as count FROM `user_short_comment` WHERE f_status = 2 ");
				$result = $this->db->select("SELECT c.comment_id,c.program_id,c.user_id,c.praise,c.f_operator_id,c.f_operator_time,c.comment_time,c.content FROM `user_short_comment` as c WHERE f_status = 2  ORDER BY c.f_operator_time DESC LIMIT {$start},{$n}");
			}else if($list == "forbid"){
				if($filter == 0){
					$this->sensitiveForbid1();
					$result_count = $this->db->get("SELECT count('f_comment_id') as count FROM `t_user_rejected` ");					
					$result = $this->db->select("SELECT c.f_comment_id,c.f_program_id,c.f_user_id,c.f_reject_desc,c.f_operator_id,c.f_operator_time FROM `t_user_rejected` as c ORDER BY c.f_operator_time DESC LIMIT {$start},{$n}");
				}else if($filter == 1){
					$result_count = $this->db->get("SELECT count('f_comment_id') as count FROM `t_user_rejected` WHERE f_operator_id != 0");
					$result = $this->db->select("SELECT c.f_comment_id,c.f_program_id,c.f_user_id,c.f_reject_desc,c.f_operator_id,c.f_operator_time FROM `t_user_rejected` as c WHERE f_operator_id != 0 ORDER BY c.f_operator_time DESC LIMIT {$start},{$n}");

				}else if($filter == 2){
					$this->sensitiveForbid1();
					$result_count = $this->db->get("SELECT count('f_comment_id') as count FROM `t_user_rejected` WHERE f_operator_id = 0");
					$result = $this->db->select("SELECT c.f_comment_id,c.f_program_id,c.f_user_id,c.f_reject_desc,c.f_operator_id,c.f_operator_time FROM `t_user_rejected` as c WHERE f_operator_id = 0 ORDER BY c.f_operator_time DESC LIMIT {$start},{$n}");
				}
			}
		}
				
		$count = $result_count['count'] ? (int) $result_count['count'] : 0;
		if($list == 'forbid' || $list == 'public'){
			for( $i = 0,$len = count($result); $i < $len; $i++){
				 $pid = $result[$i]['f_operator_id'];
				if($pid != 0){
					$this->db->changeDB(1);
					$name = $this->db->get("SELECT operator_name FROM `operator_info` WHERE `operator_id`= '{$pid}'");
					$result[$i]['f_operator_name'] = $name['operator_name'];

				}else{
					$result[$i]['f_operator_name'] = "敏感词词库";
					//$result[$i]['f_operator_time'] = $result[$i]['comment_time'];
				}
			}
			$this->db->changeDB();
		}/*else{
			$count = count($result);
		}*/

		// if($list == 'forbid' && $filter == 0 && $onOff == 0){
		// 	$result = $this->array_sort($result,'f_operator_time','desc');
		// }	

		
		$this->sendByAjax(array('ret'=>0,'ret_msg'=>'success','total'=>$count,'page'=>$n,'comment_list'=>$result));
	}

	/**
	 * @ 修改用户驳回信息记录
	 */
	private function adjustUserRecord($userid,$commentid,$proid) {
		$uid = $userid;
		$commentid = $commentid;
		$proid = $proid;
		$forbidreason = isset($_REQUEST['forbidreason']) ? intval($_REQUEST['forbidreason']) : "";
		$level = isset($_REQUEST['seriouslevel']) ? intval($_REQUEST['seriouslevel']) : "";
		$time = date("Y-m-d H:i:s",time());
		$ope = isset($_REQUEST['operid']) ? intval($_REQUEST['operid']) : "";
		$reason = isset($_REQUEST['forbidreason']) ? intval($_REQUEST['forbidreason']) : "";  
		if (!isset($_POST['accesstoken'])) {
			$this->sendByAjax(array('ret'=>1,'ret_msg'=>'你还没有登陆！'));
		} else {
			if (!$uid) {
				$this->sendByAjax(array('code'=>2,'ret_msg'=>'无效用户id'));
			}else{
			
				if (empty($uid) || empty($level) || empty($time) ||empty($ope) ){
						$this->sendByAjax(array('ret'=>6,'ret_msg'=>'提交内容不完整！'));
				}else{
					
					if($this->db->query("INSERT INTO `t_user_illegal_recored` (`f_user_id`, `f_comment_id`,`f_forbid_reason`,`f_serious_leve`,`f_operator_id`,`f_operator_time`) VALUES ('{$uid}','{$commentid}', '{$forbidreason}','{$level}' ,'{$ope}','{$time}')")){
						$this->sendByAjax(array('ret'=>0,'ret_msg'=>'adjustsuccess',"userid"=>$uid,"forbidlevel"=>$level,"forbidreason"=>$reason,"commentid"=>$commentid,"programid"=>$proid));
					}else{
						$this->sendByAjax(array('ret'=>7,'ret_msg'=>'unsuccess'));
					}
					
				}								
			}
			
		}
	}

	/**
	 * @ 获取用户驳回信息记录
	 */

	public function getUserRecord(){
		if (!isset($_POST['accesstoken'])) {
			$this->sendByAjax(array('ret'=>1,'ret_msg'=>'你还没有登陆！'));
		} else {
			$uid = isset($_REQUEST['user_id']) ? intval($_REQUEST['user_id']) : 0;
			$content = $this->db->get("SELECT f_user_id FROM `t_user_illegal_recored` WHERE `f_user_id`={$uid}");
			if (!$content)
			{

				$this->sendByAjax(array('ret'=>3,'ret_msg'=>'不存在的用户id！','userid'=>$uid));
				
			}else{
				$result = $this->db->select("SELECT u.f_forbid_reason,u.f_serious_leve,u.f_operator_time FROM `t_user_illegal_recored` as u WHERE `f_user_id`={$uid}");
				$result = $this->array_sort($result,'f_operator_time','desc');
				$this->sendByAjax(array('ret'=>0,'ret_msg'=>'success','userid'=>$uid,'forbid_list'=>$result));
			}
		}
	}


	/**
	 * @ 多维数组排序
	 */
	private function array_sort($array, $keys, $type = 'asc') {
		if (!isset($array) || !is_array($array) || empty($array)) {
			return '';
		}
		if (!isset($keys) || trim($keys) == '') {
			return '';
		}
		if (!isset($type) || $type == '' || !in_array(strtolower($type), array('asc', 'desc'))) {
			return '';
		}
		$keysvalue = array();
		foreach($array as $key => $val) {
			$val[$keys] = str_replace('-', '', $val[$keys]);
			$val[$keys] = str_replace(' ', '', $val[$keys]);
			$val[$keys] = str_replace(':', '', $val[$keys]);
			$keysvalue[] = $val[$keys];
		}
		asort($keysvalue); //key值排序
		reset($keysvalue); //指针重新指向数组第一个
		foreach($keysvalue as $key => $vals) {
			$keysort[] = $key;
		}
		$keysvalue = array();
		$count = count($keysort);
		if (strtolower($type) != 'asc') {
			for ($i = $count - 1; $i >= 0; $i--) {
				$keysvalue[] = $array[$keysort[$i]];
			}
		} else {
			for ($i = 0; $i < $count; $i++) {
				$keysvalue[] = $array[$keysort[$i]];
			}
		}
		return $keysvalue;
	}
}
	