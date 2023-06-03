<?php

class DatosUsuario{
    private $id;
    private $supercellId;
    private $fechaUltimaSesion;

    //Constructor
    function __construct($registro){
        $this->id = $registro['id'];
        $this->supercellId = $registro['supercell_id'];
        $this->fechaUltimaSesion = $registro['fecha_ultima_sesion'];
    }

    //Getters y Setters
    function getId(){
        return $this->id;
    }
    function setId($n){
        $this->id = $n;
    }
    function getSupercellId(){
        return $this->supercellId;
    }
    function setSupercellId($n){
        $this->supercellId = $n;
    }
    function getFechaUltimaSesion(){
        return $this->fechaUltimaSesion;
    }
    function setFechaUltimaSesion($n){
        $this->fechaUltimaSesion = $n;
    }

    function __toString(){
        return "Datos de usuario: ID = ".$this->id.", Supercell ID = ".$this->supercellId;
    }

    function getArrayData(){
        return array(
            "user_data" => array(
                "id" => $this->id,
                "supercell_id" => $this->supercellId
            )
        );
    }
}

?>