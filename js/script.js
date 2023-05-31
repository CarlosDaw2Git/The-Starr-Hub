//Script principal de la página
$(document).ready(function(){
    $('#shLogoNavbar').click(function(){
        window.location.reload()
    })

    $('#linkInicio').click(function(){
        window.location.reload()
    })

    $('#linkBrawlers').click(function(){
        lightLink($(this))
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
        lightLink($(this))
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
        lightLink($(this))
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
            lightLink($(this))
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
    //- Cargar noticias
    
    //- Cargar eventos
    $(document).ready(function(){
        $.ajax({
            url: 'https://api.brawlapi.com/v1/events',
            dataType: 'json',
            success: function(datosRecogidos){
                cargarEventos(datosRecogidos)
            },
            error: function(){
                console.log("Error al mostrar la información")
            }
        })
    })
})

//Sección - Barra de navegación
function lightLink(linkPulsado){
    $('#navbarSupportedContent .nav-link').each(function(){
        $(this).removeClass('link-light')
        $(this).addClass('link-dark')
    })
    linkPulsado.removeClass('link-dark')
    linkPulsado.addClass('link-light')
}

//Sección - Noticias
function cargarNoticias(datos){

}

function htmlNoticia(noticia){
    
}

//Sección - Eventos

function cargarEventos(datos){
    //Eventos activos
    for (let i = 0; i < datos.active.length; i++) {
        let evento = datos.active[i];
        $('#eventosActivos').append(htmlEventos(evento))
        //console.log(eventoActivo)
        
    }
    //Eventos siguientes
    for (let i = 0; i < datos.upcoming.length; i++) {
        let evento = datos.upcoming[i];
        $('#eventosSiguientes').append(htmlEventos(evento))
        //console.log(eventoSiguiente)
        
    }
}

function htmlEventos(evento){
    return '<div class="row"><h4 class="text-center">'+evento.map.gameMode.name+'</h4>\
    </div>'
}