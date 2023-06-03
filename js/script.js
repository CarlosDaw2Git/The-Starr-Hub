//Script principal de la página
$(document).ready(function(){
    //-Barra de navegación
    $('#navbarSupportedContent .nav-link').click(function(){
        lightLink($(this))
    })

    $('#logoInicio').click(function(){
        window.location.reload()
    })

    $('#linkInicio').click(function(){
        window.location.reload()
    })

    $('#linkNoticias').click(function(){
        $.ajax({
            type: 'GET',
            url: 'content/noticias.html',
            data: {},
            success: function(datosRecogidos){
                $('#contenidoWeb').html(datosRecogidos)
            }
        })
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

    //- Cargar noticias
    $.ajax({
        url: './data/noticias.json',
        dataType: 'json',
        success: function(datosRecogidos){
            cargarNoticias(datosRecogidos)
        },
        error: function(){
            console.log("Error al mostrar la información")
        }
    })
    //- Cargar eventos
    $.ajax({
        url: 'https://api.brawlapi.com/v1/events',
        dataType: 'json',
        success: function(datosRecogidos){
            cargarEventos(datosRecogidos)
            //console.log(datosRecogidos.active[0])
        },
        error: function(){
            console.log("Error al mostrar la información")
        }
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
    for (let i = 0; i < 3; i++){
        let noticia = datos.noticias[i]
        $('#divTarjetasNoticias').append(htmlNoticia(noticia))
    }
}

function htmlNoticia(noticia){
    return '<div class="col">\
    <div class="card h-100 border-greenBS shadow-lg">\
        <img src="./img/'+noticia.img+'" class="card-img-top" alt="...">\
        <div class="card-body">\
            <h5 class="card-title textoBS-primary text-center">'+noticia.titulo+'</h5>\
            <p class="card-text textoBS-secondary">'+noticia.subtitulo+'</p>\
            <a href="#" class="btn btn-greenBS textoBS-primary">Ver noticia</a>\
        </div>\
    </div>\
</div>'   
}

//Sección - Eventos

function cargarEventos(datos){
    //Eventos activos
    for (let i = 0; i < datos.active.length; i++) {
        let evento = datos.active[i];
        if(evento.slot.name == "Challenge"){
            $('#desafios').append(htmlEventos(evento))
        }
        else{
            $('#eventosActivos').append(htmlEventos(evento))
        }
    }
    //Eventos siguientes
    for (let i = 0; i < datos.upcoming.length; i++) {
        let evento = datos.upcoming[i];
        $('#eventosSiguientes').append(htmlEventos(evento))
    }
}

function htmlEventos(evento){
    return '\
    <div class="col-12 col-lg-6 p-3">\
        <div class="evento textoBS-primary">\
            <div class="text-bg-dark text-light text-end w-100 pe-3 fs-6 fs-lg-5">\
                El evento termina en: <span class="text-gray">'+getTiempoRestante(evento.endTime)+'</span>\
            </div>\
            <div class="gameMode container pt-2 pb-2 d-flex" style="background-color:'+evento.map.gameMode.color+';">\
                <img src="'+evento.map.gameMode.imageUrl+'" alt="" class="h-100">\
                <div class="ms-4 text-white">\
                    <h2 class="mb-0">'+evento.map.gameMode.name+'</h2>\
                    <h5>'+evento.map.name+'</h5>\
                </div>\
            </div>\
            <div class="bestTeam" style="background-image: url(\''+evento.map.environment.imageUrl+'\');">\
            </div>\
        </div>\
    </div>'
}

function getTiempoRestante(endTime){
    let currDate = new Date()
    endTime = new Date(endTime)

    miliseconds = Math.abs(endTime.getTime() - currDate.getTime())
    seconds = Math.ceil(miliseconds / 1000)

    minutes = Math.floor(seconds / 60)
    seconds = seconds % 60

    hours = Math.floor(minutes / 60)
    minutes = minutes & 60

    return hours+'H '+minutes+'M '+seconds+'S'
}