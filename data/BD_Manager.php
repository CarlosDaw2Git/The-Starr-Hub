<?php
require "BD_StarrHub.php";

//Comprobar si ya existe el usuario
if(isset($_REQUEST['validarUsuario'])){
    $usuario = $_REQUEST['usuario'];
    $clave = $_REQUEST['clave'];

    $respuesta = BD::verificarUsuario($usuario, $clave);
    if(empty($respuesta) || $respuesta == ""){
        echo json_encode(array(
            "success" => false,
            "message" => "Error: Usuario no encontrado"
        ));
    }
    else{
        $data = array(
            "success" => true,
            "message" => "Usuario encontrado"
        );
        $data = array_merge($data, $respuesta->getArrayData());
        echo json_encode($data);
    }
}

//Crear usuario
if(isset($_REQUEST['crearUsuario'])){

}
?>