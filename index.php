<?php     
if(isset($_SERVER['HTTPS']) &&  $_SERVER['HTTPS'] === 'on') {
    $base_url = "https";
}else{
    $base_url = "http"; 
}
$base_url .= "://"; 
$base_url .= $_SERVER['HTTP_HOST']; 
$path = $_SERVER['PHP_SELF']; 
$link = $base_url.$path;
$parsed_url = parse_url(strval($link));
@$partner_name = explode("/",$parsed_url['path'])[2];
$partner_form_url = "./forms/$partner_name/index.html";
$headers = @get_headers($partner_form_url); 
   
if($headers && strpos( $headers[0], '200')) { 
    header("Location: $partner_form_url");
} 
else { 
    header("Location: $base_url");
} 
?>