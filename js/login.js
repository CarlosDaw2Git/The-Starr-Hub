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

//FUNCIONES
//Validar usuario
function validarUsuario(){
    let usuario = $('#nombreLogin').val()
    /*
    if(usuario == "" || usuario == null){
        $('#error').text("Error: El usuario no puede estar vacío")
        return false
    }
    */
    let clave = $('#claveLogin').val()
    console.log(usuario, clave)
}