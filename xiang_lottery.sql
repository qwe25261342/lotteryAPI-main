# ************************************************************
# Sequel Ace SQL dump
# 版本號： 3041
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# 主機: 127.0.0.1 (MySQL 5.5.5-10.3.28-MariaDB)
# 數據庫: xiang_lottery
# 生成時間: 2021-10-04 06:52:36 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE='NO_AUTO_VALUE_ON_ZERO', SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# 轉儲表 lottery_issues
# ------------------------------------------------------------

DROP TABLE IF EXISTS `lottery_issues`;

CREATE TABLE `lottery_issues` (
  `issue` bigint(20) unsigned NOT NULL COMMENT '期數(yyyyMMddHHmm)',
  `n1` tinyint(3) unsigned NOT NULL DEFAULT 0 COMMENT '第1球, 0為未開',
  `n2` tinyint(3) unsigned NOT NULL DEFAULT 0 COMMENT '第2球, 0為未開',
  `n3` tinyint(3) unsigned NOT NULL DEFAULT 0 COMMENT '第3球, 0為未開',
  `n4` tinyint(3) unsigned NOT NULL DEFAULT 0 COMMENT '第4球, 0為未開',
  `n5` tinyint(3) unsigned NOT NULL DEFAULT 0 COMMENT '第5球, 0為未開',
  `open_at` datetime NOT NULL COMMENT '開盤時間',
  `close_at` datetime NOT NULL COMMENT '關盤時間',
  `status` tinyint(3) unsigned NOT NULL DEFAULT 0 COMMENT '期數狀態; 0:未開獎, 1:已開獎',
  `updated_at` datetime DEFAULT NULL COMMENT '更新時間',
  `created_at` datetime DEFAULT NULL COMMENT '建立時間',
  PRIMARY KEY (`issue`),
  KEY `status` (`status`,`open_at`,`close_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `lottery_issues` WRITE;
/*!40000 ALTER TABLE `lottery_issues` DISABLE KEYS */;

INSERT INTO `lottery_issues` (`issue`, `n1`, `n2`, `n3`, `n4`, `n5`, `open_at`, `close_at`, `status`, `updated_at`, `created_at`)
VALUES
	(202110040000,1,2,3,4,5,'2021-10-04 00:00:00','2021-10-04 00:09:00',1,'2021-10-04 00:00:00','2021-10-04 00:00:00'),
	(202110041500,0,0,0,0,0,'2021-10-04 15:00:00','2021-10-04 15:09:00',0,'2021-10-04 00:00:00','2021-10-04 00:00:00');
  

/*!40000 ALTER TABLE `lottery_issues` ENABLE KEYS */;
UNLOCK TABLES;


# 轉儲表 tokens
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tokens`;

CREATE TABLE `tokens` (
  `tokens` varchar(64) NOT NULL DEFAULT '' COMMENT '令牌',
  `user_id` int(10) unsigned NOT NULL COMMENT '使用者ID',
  `updated_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`tokens`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# 轉儲表 settle_history
# ------------------------------------------------------------

DROP TABLE IF EXISTS `settle_history`;

CREATE TABLE `settle_history` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '單據ID',
  `user_id` int(10) unsigned NOT NULL COMMENT '使用者ID',
  `issue` bigint(20) unsigned NOT NULL COMMENT '期數',
  `settle_n1` tinyint(3) unsigned NOT NULL COMMENT '第1球',
  `settle_n2` tinyint(3) unsigned NOT NULL COMMENT '第2球',
  `settle_n3` tinyint(3) unsigned NOT NULL COMMENT '第3球',
  `settle_n4` tinyint(3) unsigned NOT NULL COMMENT '第4球',
  `settle_n5` tinyint(3) unsigned NOT NULL COMMENT '第5球',
  `status` tinyint(3) unsigned NOT NULL COMMENT '單據狀態; 0:未結算, 1:已結算',
  `settle_amount` int(10) unsigned NOT NULL COMMENT '購買金額',
  `gain_amount` int(10) unsigned NOT NULL COMMENT '獲得金額',
  `updated_at` datetime DEFAULT NULL COMMENT '更新時間',
  `created_at` datetime DEFAULT NULL COMMENT '建立時間',
  PRIMARY KEY (`id`),
  KEY `issue` (`issue`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `settle_history` WRITE;
/*!40000 ALTER TABLE `settle_history` DISABLE KEYS */;

INSERT INTO `settle_history` (`id`, `user_id`, `issue`, `settle_n1`, `settle_n2`, `settle_n3`, `settle_n4`, `settle_n5`, `status`, `settle_amount`, `gain_amount`, `updated_at`, `created_at`)
VALUES
	(1,1,202110040000,1,2,3,20,21,1,50,250,'2021-10-04 00:10:00','2021-10-04 00:00:00'),
	(3,1,202110040000,1,3,5,7,9,1,50,0,'2021-10-04 00:10:00','2021-10-04 00:00:00'),
	(4,1,202110041500,1,3,5,7,9,0,50,0,'2021-10-04 15:00:10','2021-10-04 15:00:10');

/*!40000 ALTER TABLE `settle_history` ENABLE KEYS */;
UNLOCK TABLES;


# 轉儲表 users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '使用者ID',
  `account` varchar(255) NOT NULL DEFAULT '' COMMENT '帳號',
  `password` varchar(255) NOT NULL DEFAULT '' COMMENT '密碼',
  `nickname` varchar(255) NOT NULL DEFAULT '' COMMENT '暱稱',
  `balance` int(10) unsigned NOT NULL DEFAULT 0 COMMENT '餘額',
  `lastlogin_at` datetime DEFAULT NULL COMMENT '上次登入時間',
  `updated_at` datetime DEFAULT NULL COMMENT '更新時間',
  `created_at` datetime DEFAULT NULL COMMENT '建立時間',
  PRIMARY KEY (`id`),
  UNIQUE KEY `account` (`account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `account`, `password`, `nickname`, `balance`, `lastlogin_at`, `updated_at`, `created_at`)
VALUES
	(1,'testman','test','TestMan',1000,NULL,'2021-10-04 00:00:00','2021-10-04 00:00:00');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
