<?php
include("T_Usuario.php");
include("T_DatosUsuario.php");


class BD{
    //Conexión con la base de datos
    public static function realizarConexion(){
        $ip = "localhost";
        $nombreBD = "starrhub";
        $usuarioBD = "root";
        $claveBD = ""; 
        try{
            $conexion = new PDO("mysql:host=".$ip."; dbname=".$nombreBD, $usuarioBD, $claveBD);
            $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $conexion->exec("SET CHARACTER SET utf8");
            return $conexion;
        }
        catch (PDOException $e){
            echo 'Error en realizarConexión(): '.$e->getMessage();
            return null;
        }
    }

    //Sentencias SELECT
    public static function selectUsuarioByNombre($nombreUsuario){
        $usuario = null;
        try{
            $sql = "SELECT * FROM usuarios WHERE nombreUsuario = ?";
            $conexion = self::realizarConexion();
            $resultado = $conexion->prepare($sql);
            $resultado->execute(array($nombreUsuario));
            $fila = $resultado->fetch();
            $resultado->closeCursor();
            $conexion = null;
            if(!empty($fila)){
                $usuario = new Usuario($fila);

            }
        }
        catch(PDOException $e){
            echo "Error en verificarUsuario(): ".$e->getMessage();
        }
        finally{
            return $usuario;
        }
    }

    public static function selectUsuarioById($idUsuario){
        $usuario = null;
        try{
            $sql = "SELECT * FROM usuarios WHERE idUsuario = ?";
            $conexion = self::realizarConexion();
            $resultado = $conexion->prepare($sql);
            $resultado->execute(array($idUsuario));
            $fila = $resultado->fetch();
            $resultado->closeCursor();
            $conexion = null;
            if(!empty($fila)){
                $usuario = new Usuario($fila);

            }
        }
        catch(PDOException $e){
            echo "Error en selectUsuarioById(): ".$e->getMessage();
        }
        finally{
            return $usuario;
        }
    }

    public static function selectDatosUsuarioById($idUsuario){
        $datosUsuario = null;
        try{
            $sql = "SELECT * FROM datos_usuario WHERE id = ?";
            $conexion = self::realizarConexion();
            $resultado = $conexion->prepare($sql);
            $resultado->execute(array($idUsuario));
            $fila = $resultado->fetch();
            $resultado->closeCursor();
            $conexion = null;
            if(!empty($fila)){
                $datosUsuario = new DatosUsuario($fila);

            }
        }
        catch(PDOException $e){
            echo "Error en selectDatosUsuarioById(): ".$e->getMessage();
        }
        finally{
            return $datosUsuario;
        }
    }

    //SENTENCIAS INSERT
    public static function insertUsuario($nombreUsuario, $clave){
        $exito = false;
        try{
            $sql = "INSERT INTO usuarios(nombreUsuario, claveUsuario) 
            VALUES(?, md5(?))";
            $conexion = self::realizarConexion();
            $resultado =  $conexion->prepare($sql);
            $afectados = $resultado->execute(array($nombreUsuario, $clave));
            if ($afectados > 0){
                $exito= true;
            }
        }
        catch(PDOException $e){
            echo "Error en insertUsuario(): ".$e->getMessage();
        }
        finally{
            $resultado->closeCursor();
            $conexion = null;
            return $exito;
        }
    }

    public static function insertDatosUsuario($idUsuario){
        $exito = false;
        try{
            $sql = "INSERT INTO datos_usuario(id) VALUES (?)";
            $conexion = self::realizarConexion();
            $resultado =  $conexion->prepare($sql);
            $afectados = $resultado->execute(array($idUsuario));
            if ($afectados > 0){
                $exito= true;
            }
        }
        catch(PDOException $e){
            echo "Error en insertDatosUsuario(): ".$e->getMessage();
        }
        finally{
            $resultado->closeCursor();
            $conexion = null;
            return $exito;
        }
    }
}
