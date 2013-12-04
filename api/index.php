<?php
header('Access-Control-Allow-Origin: *');
header('Content-type: application/json');

// This is a fix to grab POST data when using Microsoft IIS Rewrite
parse_str(file_get_contents('php://input'), $_POST);

// Throw HTTP Error
function throwHTTPError($code) {
	if (!is_numeric($code)) $code = 500;
	$code = (int) $code;
	$replay = array();
	switch ($code) {
	case 401:
		$status = 'Unauthorized';
		header('WWW-Authenticate: Digest realm="Realm",qop="auth",nonce="'.uniqid().'",opaque="'.md5('Realm').'"');
		$reply = array('error' => 'Authorized Users Only',);
		break;
	case 418:
		$status = "I'm a teapot";
		$reply = array('error' => 'No coffee here',);
		break;
	case 500:
		$status = "Internal Server Error";
		break;
	case 420:
	case 429:
		$status = "Enhance Your Calm";
		$reply = array('error' => 'Too many requests sent.');
		break;
	case 404:
	default:
		$code = 404;
		$status = "Not Found";
	}
	header("HTTP/1.1 $code $status");
	echo json_encode($reply);
	exit;
}

// function to parse the http auth header, http://php.net/manual/en/features.http-auth.php
function http_digest_parse($txt) {
	// protect against missing data
	$needed_parts = array('nonce'=>1, 'nc'=>1, 'cnonce'=>1, 'qop'=>1, 'username'=>1, 'uri'=>1, 'response'=>1);
	$data = array();
	$keys = implode('|', array_keys($needed_parts));

	preg_match_all('@(' . $keys . ')=(?:([\'"])([^\2]+?)\2|([^\s,]+))@', $txt, $matches, PREG_SET_ORDER);

	foreach ($matches as $m) {
		$data[$m[1]] = $m[3] ? $m[3] : $m[4];
		unset($needed_parts[$m[1]]);
	}

	return $needed_parts ? false : $data;
}

$url = $_SERVER['HTTP_X_REWRITE_URL'];

switch($url) {
case '/start': // Login
	echo json_encode(array('hello' => 'world'));
	exit;
}

header('Content-type: text/html', true);
?>
<h1>Hello World</h1>
<div>More content to come</div>