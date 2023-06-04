//Si el usuario ya está registrado e intenta acceder a la página
//de login, se volverá a la página principal
if(comprobarCookie("userID")){
    window.location = "index.html"
}

$(document).ready(function(){
    $("#btnVolverMain").click(function(){
        window.location = "index.html"
    })

    $("#verificar").click(function(){
        validarUsuario()
    })

    $("#registrarse").click(function(){
        $.ajax({
            type: 'GET',
            url: 'content/registro.html',
            data: {},
            success: function(datosRecogidos){
                $('#divContenidoLogin').html(datosRecogidos)
            }
        })
    })
})

$(document).on("click", "#volver",function(){
    window.location.reload()
})

$(document).on("click", "#registrarUsuario", function(){
    registrarUsuario()
})

//FUNCIONES
//Validar usuario
function validarUsuario(){
    $('#error').text("")

    let usuario = $('#nombreLogin').val()
    if(usuario == "" || usuario == null){
        $('#error').text("Error: El usuario no puede estar vacío")
        return false
    }

    let clave = $('#claveLogin').val()
    if(clave == "" || clave == null){
        $('#error').text("Error: La contraseña no puede estar vacío")
        return false
    }

    let fecha = new Date().toLocaleString('es-ES')

    $.ajax({
        data : {
            'validarUsuario' : 'true',
            'usuario': usuario,
            'clave': clave,
            'fecha': fecha.split(',')[0]
        },
        url: './data/BD_Manager.php',
        type: 'POST',
        success: function(datosRecogidos){
            let datosJson = JSON.parse(datosRecogidos)
            if(datosJson.success == false){
                $('#error').html(datosJson.message)
            }
            else{
                crearCookie("userID", datosJson.user.id)
                window.location = "./index.html"
            }
        }
    })
}

function registrarUsuario(){
    $('#error').text("")

    let usuario = $('#nombreRegistro').val()
    if(usuario == "" || usuario == null){
        $('#error').text("Error: El usuario no puede estar vacío")
        return false
    }

    let clave = $('#claveRegistro').val()
    if(clave == "" || clave == null){
        $('#error').text("Error: La contraseña no puede estar vacío")
        return false
    }

    let repiteClave = $('#repetirClaveRegistro').val()
    if(repiteClave == "" || repiteClave == null){
        $('#error').text("Error: Vuelva a escribir la contraseña en el siguiente campo")
        return false
    }

    if(clave != repiteClave){
        $('#error').text("Error: Las contraseñas no cohinciden")
        return false
    }

    $.ajax({
        data : {
            'crearUsuario' : 'true',
            'usuario': usuario,
            'clave': clave
        },
        url: './data/BD_Manager.php',
        type: 'POST',
        success: function(datosRecogidos){
            let datosJson = JSON.parse(datosRecogidos)
            alert(datosJson.message)
            if(datosJson.success == true){
                window.location.reload()
            }
        }
    })
}