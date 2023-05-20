//Script principal de la página
$(document).ready(function(){
    $('#linkInicio').click(function(){
        window.location.reload()
    })

    $('#linkBrawlers').click(function(){
        $.ajax({
            type: 'GET',
            url: 'content/brawlers.html',
            data: {},
            success: function(datosRecogidos){
                $('#contenidoWeb').html(datosRecogidos)
            }
        })
    })

    $('#linkMapas').click(function(){
        $.ajax({
            type: 'GET',
            url: 'content/mapas.html',
            data: {},
            success: function(datosRecogidos){
                $('#contenidoWeb').html(datosRecogidos)
            }
        })
    })

    $('#linkModosJuego').click(function(){
        $.ajax({
            type: 'GET',
            url: 'content/modosJuego.html',
            data: {},
            success: function(datosRecogidos){
                $('#contenidoWeb').html(datosRecogidos)
            }
        })
    })

    //Comprobar si está la cookie de usuario
    if(comprobarCookie("userID")){
        $('#linkPerfil').text("Perfil")
        $('#linkPerfil').click(function(){
            $.ajax({
                type: 'GET',
                url: 'content/perfil.html',
                data: {},
                success: function(datosRecogidos){
                    $('#contenidoWeb').html(datosRecogidos)
                }
            })
        })
    }
    else{
        $('#linkPerfil').click(function(){
            window.location = "login.html"
        })
    }
})