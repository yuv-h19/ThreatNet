<?php
$host="localhost"; //להשאיר ככה
$user="yuvalho2_root"; //מה שנתנו לו בהגדרות
$pass="NPw11u@7&cZjlnY-"; //להחליף לסיסמא שלנו
$db="yuvalho2_ThreatNet";

//create connection
$conn=new mysqli($host,$user,$pass,$db);
if ($conn->connect_error){
 die("Connection failed: ".$conn->connect_error);}


$campaign_Name = $_POST['campaignName'];
$attack_Vector = $_POST['attackVector'];
$severity = $_POST['severity'];
$target_sector = $_POST['targetSector'];
$first_observed = $_POST['firstObserved'];
$description = $_POST['description'];
$country = $_POST['targetCountry'];

$sql = "INSERT INTO campaigns 
(campaign_Name, attack_Vector, severity, target_sector, first_observed, description, target_country)
VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);  
$stmt->bind_param("ssissss", $campaign_Name, $attack_Vector, $severity, $target_sector, $first_observed, $description, $country);
if ($stmt->execute()){
    // Update this to your exact Express route path
    $windowsServerUrl = "http://vmedu444.mtacloud.co.il:3000/campaign-confirmation?success=true";
    
    header("Location: " . $windowsServerUrl);
    exit();

} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}
?>

