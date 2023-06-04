<?php
require "BD_StarrHub.php";

//Datos de salida
$data = array(
    "success" => false,
    "message" => ""
);

//Comprobar los datos del formulario de login
if(isset($_REQUEST['validarUsuario'])){
    $nombreUsuario = $_REQUEST['usuario'];
    $clave = $_REQUEST['clave'];
    $fecha = $_REQUEST['fecha'];
    
    //Buscar usuario
    $usuario = BD::selectUsuarioByNombre($nombreUsuario);
    if(empty($usuario)){
        $data['message'] = "Error: Usuario no encontrado";
    }
    else{
        //Comprobar contraseña
        if($usuario->getClave() == md5($clave)){
            $data['success'] = true;
            $data['message'] = "Usuario encontrado";
            $data = array_merge($data, $usuario->getArrayData());

            //Actualizar fecha del último inicio de sesion
            BD::updateFechaRegistro($usuario->getId(), $fecha);

        }
        else{
            $data['message'] = "Error: Contraseña incorrecta";
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
            $data['success'] = true;
            $data['message'] = "Usuario creado correctamente";
            /*
            DISEÑO ANTERIOR

            //Busca el id del usuario y crea una entrada en la tabla
            //de datos de usuario
            
            $usuario = BD::selectUsuarioByNombre($nombreUsuario);
            $exitoDatos = BD::insertDatosUsuario($usuario->getId());
            if($exitoDatos){
                $data['success'] = true;
                $data['message'] = "Usuario y datos creados correctamente";
            }
            else{
                $data['message'] = "Error: No se pudo crear los datos de usuario";
            }
            */
        }
        else{
            $data['message'] = "Error: No se pudo dar de alta al usuario";
        }
    }
}

//Obtener datos del usuario
if(isset($_REQUEST['getDatosUsuario'])){
    $idUsuario = $_REQUEST['idUsuario'];
    $usuario = BD::selectUsuarioById($idUsuario);
    if(empty($usuario)){
        $data['message'] = "Error: Usuario no encontrado";
    }
    else{
        $datosUsuario = BD::selectDatosUsuarioById($idUsuario);
        if(empty($datosUsuario)){
            $data['message'] = "Error: Datos del usuario no encontrados";
        }
        else{
            $data['success'] = true;
            $data['message'] = "Usuario y datos encontrados";
            $data = array_merge($data, $usuario->getArrayData());
            $data = array_merge($data, $datosUsuario->getArrayData());
        }
    }
}

//Cambiar datos del usuario
if(isset($_REQUEST['cambiarDatosUsuario'])){
    $id = $_REQUEST['id'];
    $nombre = $_REQUEST['usuario'];
    $supercell_id = $_REQUEST['supercell_id'];

    $exito = BD::updateDatosUsuario($id, $nombre, $supercell_id);
    if($exito){
        $data['success'] = true;
        $data['message'] = "Datos actualizados correctamente";
    }
    else{
        $data['message'] = "Error: No se han podido actualizar los datos del usuario";
    }
}

//Cambiar clave del usuario
if(isset($_REQUEST['cambiarClave'])){
    $id = $_REQUEST['id'];
    $clave = $_REQUEST['clave'];

    $exito = BD::updateClaveUsuario($id, $clave);
    if($exito){
        $data['success'] = true;
        $data['message'] = "Contraseña actualizada correctamente";
    }
    else{
        $data['message'] = "Error: No se han podido actualizar la contraseña";
    }
}

//Guardar feedback

//El servidor da una respuesta
echo json_encode($data);
?>