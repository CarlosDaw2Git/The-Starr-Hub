<?php


class BD{
    public static function realizarConexión(){
        $ip = "localhost";
        $nombreBD = "starrhub";
        $usuario = "root";
        $clave = "";   
        try{
            $conexion = new PDO("mysql:host=".$ip."; dbname=".$nombreBD, $usuario, $clave);
            $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $conexion->exec("SET CHARACTER SET utf8");
            return $conexion;
        }
        catch (Exception $e){
            echo '<script>console.log("'.$e->getMessage().'")';
        }
    }

    public static function getUsuario(){
        
    }
}
?>