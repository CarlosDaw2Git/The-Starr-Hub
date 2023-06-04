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

    public static function insertMensaje($id, $msg){
        $exito = false;
        try{
            $sql = "INSERT INTO mensajes(id_usuario, mensaje) VALUES(?, ?)";
            $conexion = self::realizarConexion();
            $resultado =  $conexion->prepare($sql);
            $afectados = $resultado->execute(array($id, $msg));
            if ($afectados > 0){
                $exito= true;
            }
        }
        catch(PDOException $e){
            echo "Error en insertMensaje(): ".$e->getMessage();
        }
        finally{
            $resultado->closeCursor();
            $conexion = null;
            return $exito;
        }
    }

    //SENTENCIAS UPDATE
    public static function updateFechaRegistro($idUsuario, $fecha){
        $exito = false;
        try{
            $sql = "UPDATE datos_usuario SET fecha_ultima_sesion = ?
            WHERE id = ?";
            $conexion = self::realizarConexion();
            $resultado =  $conexion->prepare($sql);
            $afectados = $resultado->execute(array($fecha, $idUsuario));
            if ($afectados > 0){
                $exito= true;
            }
        }
        catch(PDOException $e){
            echo "Error en updateFechaRegistro(): ".$e->getMessage();
        }
        finally{
            $resultado->closeCursor();
            $conexion = null;
            return $exito;
        }
    }

    public static function updateDatosUsuario($id, $nombre, $supercell_id){
        $exito = false;
        $arrDatos = array("id" => $id, "nombre" => $nombre,);
        try{
            $sql = "UPDATE usuarios SET nombreUsuario = :nombre WHERE idUsuario = :id;";
            if(empty($supercell_id)){
                $sql = $sql."UPDATE datos_usuario SET supercell_id = NULL WHERE id = :id;";
            }
            else{
                $sql = $sql."UPDATE datos_usuario SET supercell_id = :supercell_id WHERE id = :id;";
                $arrDatos = array_merge($arrDatos, array("supercell_id" => $supercell_id));
            }
            $conexion = self::realizarConexion();
            $resultado = $conexion->prepare($sql);
            $afectados = $resultado->execute($arrDatos);
            if ($afectados > 0){
                $exito= true;
            }
        }
        catch(PDOException $e){
            echo "Error en updateFechaRegistro(): ".$e->getMessage();
        }
        finally{
            $resultado->closeCursor();
            $conexion = null;
            return $exito;
        }
    }

    public static function updateClaveUsuario($id, $clave){
        $exito = false;
        try{
            $sql = "UPDATE usuarios SET claveUsuario = md5(?) WHERE idUsuario = ?";
            $conexion = self::realizarConexion();
            $resultado = $conexion->prepare($sql);
            $afectados = $resultado->execute(array($clave, $id));
            if ($afectados > 0){
                $exito= true;
            }
        }
        catch(PDOException $e){
            echo "Error en updateFechaRegistro(): ".$e->getMessage();
        }
        finally{
            $resultado->closeCursor();
            $conexion = null;
            return $exito;
        }
    }
}
