<?php

class Usuario{
    private $id;
    private $nombre;
    private $clave;

    //Constructor
    function __construct($registro){
        $this->id = $registro['idUsuario'];
        $this->nombre = $registro['nombreUsuario'];
        $this->clave = $registro['claveUsuario'];
    }

    //Getters
    function getId(){
        return $this->id;
    }
    function getNombre(){
        return $this->nombre;
    }
    function getClave(){
        return $this->clave;
    }

    //Setters
    function setId($n){
        $this->id = $n;
    }
    function setNombre($n){
        $this->nombre = $n;
    }
    function setClave($n){
        $this->clave = $n;
    }

    function __toString(){
        return "Usuario: ID = ".$this->id.", Nombre = ".$this->nombre.", Clave = ".$this->clave;
    }

    function getArrayData(){
        return array(
            "user" => array(
                "id" => $this->id,
                "nombre" => $this->nombre,
                "clave" => $this->clave
            )
        );
    }
}

?>