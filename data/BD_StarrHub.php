<?php
include("T_Usuario.php");

class BD{
    public static function realizarConexion(){
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
            //echo '<script>console.log("Error en realizarConexión(): '.$e->getMessage().'")';
            return null;
        }
    }

    public static function verificarUsuario($nombreUsuario, $clave){
        $usuario = null;
        try{
            $sql = "SELECT * FROM usuarios WHERE nombreUsuario = ? 
            AND claveUsuario = md5(?)";
            $conexion = self::realizarConexion();
            $resultado = $conexion->prepare($sql);
            $resultado->execute(array($nombreUsuario, $clave));
            $fila = $resultado->fetch();
            $resultado->closeCursor();
            $conexion = null;
            if(!empty($fila)){
                $usuario = new Usuario($fila);

            }
        }
        catch(Exception $e){
            echo "<script>console.log('Error en verificarUsuario(): ".$e->getMessage()."')</script>";
        }
        finally{
            return $usuario;
        }
    }
}
?>