<?php
require "BD_StarrHub.php";

//Datos de salida
$data = array(
    "success" => false,
    "message" => ""
);

//Comprobar si ya existe el usuario
if(isset($_REQUEST['validarUsuario'])){
    $nombreUsuario = $_REQUEST['usuario'];
    $clave = $_REQUEST['clave'];
    
    $usuario = BD::selectUsuarioByNombre($nombreUsuario);
    if(empty($usuario)){
        $data['message'] = "Error: Usuario no encontrado";
    }
    else{
        if($usuario->getClave() == md5($clave)){
            $data['success'] = true;
            $data['message'] = "Usuario encontrado";
            $data = array_merge($data, $usuario->getArrayData());
        }
        else{
            $data['message'] = "Error: contraseña incorrecta";
        }
    }
}

//Crear usuario
if(isset($_REQUEST['crearUsuario'])){
    $nombreUsuario = $_REQUEST['usuario'];
    $clave = $_REQUEST['clave'];

    /*
    Comprobar que no haya un usuario con el mismo nombre
        -Nota: para no poner tantas condiciones dentro de otras condiciones, 
        he colocado esta condición a parte
    */
    $comprobarUsuario = BD::selectUsuarioByNombre($nombreUsuario);
    if(!empty($comprobarUsuario)){
        $data['message'] = "Error: Ya existe un usuario con ese nombre";
    }
    else{
         //Crea el usuario
        $exitoUsuario = BD::insertUsuario($nombreUsuario, $clave);
        if($exitoUsuario){
            /*
            Busca el id del usuario y crea una entrada en la tabla
            de datos de usuario
            */
            $usuario = BD::selectUsuarioByNombre($nombreUsuario);
            $exitoDatos = BD::insertDatosUsuario($usuario->getId());
            if($exitoDatos){
                $data['success'] = true;
                $data['message'] = "Usuario y datos creados correctamente";
            }
            else{
                $data['message'] = "Error: No se pudo crear los datos de usuario";
            }
        }
        else{
            $data['message'] = "Error: No se pudo dar de alta al usuario";
        }
    }
}

//El servidor da una respuesta
echo json_encode($data);
?>