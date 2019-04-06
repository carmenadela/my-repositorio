<?php

$arr_clientes = array('nombre'=> 'Jose', 'edad'=> '20', 'genero'=> 'masculino',
        'email'=> 'correodejose@dominio.com', 'localidad'=> 'Madrid', 'telefono'=> '91000000');


//Creamos el JSON


$json_string = json_encode($arr_clientes);


$fh = fopen("clientes.json", 'w') or die("Se produjo un error al crear el archivo");
  
 
fwrite($fh, $json_string) or die("No se pudo escribir en el archivo");


//Leemos el JSON
$datos_clientes = file_get_contents("clientes.json");

$json_clientes = json_decode($datos_clientes, true);

print_r($json_clientes);
echo "<br>";
echo $json_clientes['nombre'];
echo "<br>";
foreach ($json_clientes as $cliente) {
    
    echo $cliente."<br>";
}

fclose($fh);
?>

<!DOCTYPE html>
<html>

<head>
    <title>Pruebas Bootstrap</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <link rel="stylesheet" href="css/bootstrap.min.css" />

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js" type="text/javascript"></script>
    <script src="js/bootstrap.min.js" type="text/javascript"></script>    
    <script src="js/main.js" type="text/javascript"></script>    
    
</head>


<body>

    
</body>
<div >
</div>
</html> 
