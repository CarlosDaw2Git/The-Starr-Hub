//Script principal de la página
$(document).ready(function () {
    //-Barra de navegación
    $('#navbarSupportedContent .nav-link').click(function () {
        if (!$(this).is($('#linkPerfil'))) {
            lightLink($(this))
            $('title').text($(this).text())
        }

    })

    $('#logoInicio').click(function () {
        window.location.reload()
    })

    $('#linkInicio').click(function () {
        window.location.reload()
    })

    $('#linkNoticias').click(function () {
        $.ajax({
            type: 'GET',
            url: 'content/noticias.html',
            data: {},
            success: function (datosRecogidos) {
                $('#contenidoWeb').html(datosRecogidos)
            }
        })
    })

    $('#linkBrawlers').click(function () {
        $.ajax({
            type: 'GET',
            url: 'content/brawlers.html',
            data: {},
            success: function (datosRecogidos) {
                $('#contenidoWeb').html(datosRecogidos)
            }
        })
    })

    $('#linkMapas').click(function () {
        $.ajax({
            type: 'GET',
            url: 'content/mapas.html',
            data: {},
            success: function (datosRecogidos) {
                $('#contenidoWeb').html(datosRecogidos)
            }
        })
    })

    $('#linkModosJuego').click(function () {
        $.ajax({
            type: 'GET',
            url: 'content/modosJuego.html',
            data: {},
            success: function (datosRecogidos) {
                $('#contenidoWeb').html(datosRecogidos)
            }
        })
    })

    //Comprobar si está la cookie de usuario
    if (comprobarCookie("userID")) {
        //PERFIL
        $('#linkPerfil').text("Perfil")
        $('#linkPerfil').attr('data-bs-toggle', 'modal')
        $('#linkPerfil').attr('data-bs-target', '#modalPerfil')
        $('#linkPerfil').click(function () {
            cargarDatosPerfil(getValorCookie('userID'))
        })

        //FEEDBACK
        $('#avisoFeedback').text('')
        $('#btnFeedback').removeClass('disabled')
        $('#btnFeedback').click(function(){
            enviarFeedback()
        })
    }
    else {
        //PERFIL
        $('#linkPerfil').click(function () {
            window.location = "login.html"
        })
    }

    //- Cargar noticias
    $.ajax({
        url: './data/noticias.json',
        dataType: 'json',
        success: function (datosRecogidos) {
            cargarNoticias(datosRecogidos)
        },
        error: function () {
            console.log("Error al mostrar la información")
        }
    })

    //- Cargar eventos
    $.ajax({
        url: 'https://api.brawlapi.com/v1/events',
        dataType: 'json',
        success: function (datosRecogidos) {
            cargarEventos(datosRecogidos)
        },
        error: function () {
            console.log("Error al mostrar la información")
        }
    })
})

//Sección - Perfil
function cargarDatosPerfil(idUsuario) {
    $.ajax({
        data: {
            'getDatosUsuario': 'true',
            'idUsuario': idUsuario
        },
        url: './data/BD_Manager.php',
        type: 'POST',
        success: function (datosRecogidos) {
            let datosJson = JSON.parse(datosRecogidos)

            //Rellenar modal
            $('.modal-title').text('Datos del perfil')
            $('.modal-body').html('\
                <p><b>Nombre de usuario:</b>&nbsp;<span id="nombreUsuario"></span></p>\
                <p><b>Supercell ID:</b>&nbsp;<span id="supercell_id"></span></p>\
                <p><b>Última conexión:</b>&nbsp;<span id="ultimaConexion"></span></p>\
                <button id="editarPerfil" class="btn btn-primary textoBS-primary">Editar perfil</button>\
            ')
            $('.modal-footer').removeClass('visually-hidden')
            $('.modal-footer').html('\
                <button id="btnPerfilBrawlify" class="btn btn-warning textoBS-primary disabled">Perfil Brawlify (Página externa)</button>\
                <button id="btnCerrarSesion" class="btn btn-danger textoBS-primary">Cerrar sesión</button>\
            ')
            //Funcion boton editar perfil
            $('#editarPerfil').click(function () {
                htmlEditarPerfil(datosJson)
            })

            //Rellenar los datos de usuario
            $('#nombreUsuario').text(datosJson.user.nombre)
            $('#ultimaConexion').text(datosJson.user_data.fecha_ultima_sesion)

            let supercellId = datosJson.user_data.supercell_id
            if (supercellId == null) {
                $('#supercell_id').text('No asignado')
            }
            else {
                $('#supercell_id').text('#' + supercellId)
                $('#btnPerfilBrawlify').removeClass('disabled')
                $('#btnPerfilBrawlify').click(function () {
                    window.open('https://brawlify.com/es/stats/profile/' + supercellId, '_blank')
                })
            }
        }
    })
}

//Boton de cerrar sesion
$(document).on('click', '#btnCerrarSesion', function(){
    borrarCookie('userID')
    window.location.reload()
})

function htmlEditarPerfil(datosJson) {
    let supercell_id = "";
    if(datosJson.user_data.supercell_id != null){
        supercell_id = datosJson.user_data.supercell_id
    }
    $('.modal-title').text('Editar perfil')
    $('.modal-body').html('\
        <label for="edit_nombre" class="fw-bolder">Nombre:&nbsp;</label>\
        <input type="text" id="edit_nombre" value="'+datosJson.user.nombre+'" class="mb-3"></input><br>\
        <label for="edit_supercell_id" class="fw-bolder">Supercell ID:&nbsp;</label>\
        <input type="text" id="edit_supercell_id" value="'+supercell_id+'" class="mb-3"></input><br>\
        <button id="confirmar_datos" class="btn btn-primary textoBS-primary mb-3">Editar datos</button><br>\
        <label for="edit_clave" class="fw-bolder">Nueva contraseña:&nbsp;</label>\
        <input type="password" id="edit_clave" class="mb-3"></input><br>\
        <label for="edit_clave_2" class="fw-bolder">Repetir contraseña:&nbsp;</label>\
        <input type="password" id="edit_clave_2" class="mb-3"></input><br>\
        <button id="confirmar_clave" class="btn btn-danger textoBS-primary mb-3">Editar contraseña</button>\
        <p id="msgError" class="text-danger"></p>\
    ')
    $('.modal-footer').addClass('visually-hidden')

    $('#confirmar_datos').click(function(){
        cambiarDatosUsuario()
    })
    $('#confirmar_clave').click(function(){
        cambiarClave()
    })
}

function cambiarDatosUsuario(){
    $('#msgError').text("")
    let usuario = $('#edit_nombre').val()
    if(usuario == "" || usuario == null){
        $('#msgError').text("Error: El usuario no puede estar vacío")
        return false
    }

    let supercell_id = $('#edit_supercell_id').val()
    if(supercell_id == "" || supercell_id == "null"){
        supercell_id = null
    }

    $.ajax({
        data : {
            'cambiarDatosUsuario' : 'true',
            'id': getValorCookie('userID'),
            'usuario': usuario,
            'supercell_id': supercell_id
        },
        url: './data/BD_Manager.php',
        type: 'POST',
        success: function(datosRecogidos){
            let datosJson = JSON.parse(datosRecogidos)
            alert(datosJson.message)
        }
    })
}

function cambiarClave(){
    $('#msgError').text("")

    let clave = $('#edit_clave').val()
    if(clave == "" || clave == null){
        $('#msgError').text("Error: La contraseña no puede estar vacía")
        return false
    }

    let repiteClave = $('#edit_clave_2').val()
    if(repiteClave == "" || repiteClave == null){
        $('#msgError').text("Error: Vuelva a escribir la contraseña en el siguiente campo")
        return false
    }

    if(clave != repiteClave){
        $('#msgError').text("Error: Las contraseñas no cohinciden")
        return false
    }

    $.ajax({
        data : {
            'cambiarClave' : 'true',
            'id': getValorCookie('userID'),
            'clave': clave
        },
        url: './data/BD_Manager.php',
        type: 'POST',
        success: function(datosRecogidos){
            let datosJson = JSON.parse(datosRecogidos)
            alert(datosJson.message)
        }
    })
}

//Sección - Barra de navegación
function lightLink(linkPulsado) {
    $('#navbarSupportedContent .nav-link').each(function () {
        $(this).removeClass('link-light')
        $(this).addClass('link-dark')
    })
    linkPulsado.removeClass('link-dark')
    linkPulsado.addClass('link-light')
}

//Sección - Noticias
function cargarNoticias(datos) {
    for (let i = 0; i < 3; i++) {
        let noticia = datos.noticias[i]
        $('#divTarjetasNoticias').append(htmlNoticia(noticia))
    }
}

function htmlNoticia(noticia) {
    return '<div class="col">\
    <div class="card h-100 border-greenBS shadow-lg">\
        <img src="./img/'+ noticia.img + '" class="card-img-top" alt="...">\
        <div class="card-body">\
            <h5 class="card-title textoBS-primary text-center tituloNoticia">'+ noticia.titulo + '</h5>\
            <p class="card-text textoBS-secondary">'+ noticia.subtitulo + '</p>\
            <a href="#" class="btn btn-greenBS textoBS-primary verNoticia">Ver noticia</a>\
        </div>\
    </div>\
</div>'
}

$(document).on("click", ".verNoticia", function(){
    cargarNoticiaMain($(this).parent().find('.tituloNoticia').text())
})

//Sección - Eventos

function cargarEventos(datos) {
    //Eventos activos
    for (let i = 0; i < datos.active.length; i++) {
        let evento = datos.active[i];
        if (evento.slot.name == "Challenge") {
            $('#desafios p').remove()
            $('#desafios').append(htmlEventos(evento))
        }
        else {
            $('#eventosActivos').append(htmlEventos(evento))
        }
    }
    //Eventos siguientes
    for (let i = 0; i < datos.upcoming.length; i++) {
        let evento = datos.upcoming[i];
        $('#eventosSiguientes').append(htmlEventos(evento))
    }
}

function htmlEventos(evento) {
    return '\
    <div class="col-12 col-lg-6 p-3">\
        <div id="'+evento.map.id+'" class="contMapa evento textoBS-primary" type="button" \
        data-bs-toggle="offcanvas" data-bs-target="#multiCanvas">\
            <div class="text-bg-dark text-light text-end w-100 pe-2 fs-6 fs-lg-5">\
                El evento termina en: <span class="text-gray pe-3">'+ getTiempoRestante(evento.endTime) + '</span>\
            </div>\
            <div class="gameMode container pt-2 pb-2 d-flex" style="background-color:'+ evento.map.gameMode.color + ';">\
                <img src="'+ evento.map.gameMode.imageUrl + '" alt="" class="h-100">\
                <div class="ms-4 text-white">\
                    <h2 class="mb-0">'+ evento.map.gameMode.name + '</h2>\
                    <h5>'+ evento.map.name + '</h5>\
                </div>\
            </div>\
            <div class="bestTeam" style="background-image: url(\''+ evento.map.environment.imageUrl + '\');">\
            </div>\
        </div>\
    </div>'
}

function getTiempoRestante(endTime) {
    let currDate = new Date()
    endTime = new Date(endTime)

    miliseconds = Math.abs(endTime.getTime() - currDate.getTime())
    seconds = Math.ceil(miliseconds / 1000)

    minutes = Math.floor(seconds / 60)
    seconds = seconds % 60

    hours = Math.floor(minutes / 60)
    minutes = minutes & 60

    return hours + 'H ' + minutes + 'M ' + seconds + 'S'
}

//Sección - Coméntanos tu feedback
function enviarFeedback(){
    $('#avisoFeedback').text('')

    let msg = $('#msgFeedback').val()
    if(msg == "" || msg == null){
        $('#avisoFeedback').text('El mensaje no puede estar vacio')
        return false;
    }
    if(msg.length > 120){
        $('#avisoFeedback').text('El mensaje no puede ocupar más de 120 caracteres')
        return false;
    }

    $.ajax({
        data : {
            'guardarFeedback' : 'true',
            'id': getValorCookie('userID'),
            'msg': msg
        },
        url: './data/BD_Manager.php',
        type: 'POST',
        success: function(datosRecogidos){
            let datosJson = JSON.parse(datosRecogidos)
            alert(datosJson.message)
            $('#msgFeedback').val("")
        }
    })

}

//APARTADO PARA CARGAR LAS NOTICIAS EN EL MAIN
function cargarNoticiaMain(titulo){
    lightLink($('#linkNoticias'))

    $.ajax({
        url: './data/noticias.json',
        dataType: 'json',
        success: function (datosRecogidos) {
            for (let i = 0; i < datosRecogidos.noticias.length; i++){
                let noticia = datosRecogidos.noticias[i]
                if(noticia.titulo == titulo){
                    $('#contenidoWeb').html(htmlNoticiaMain(noticia))
                    return true
                }
            }
        },
        error: function () {
            console.log("Error al mostrar la información")
        }
    })
}

function htmlNoticiaMain(noticia){
    return '<div class="container noticiaMain" style="background-image: url(./img/'+noticia.img+');"></div>\
        <div class="mt-3">\
            <h2 class="titulo textoBS-primary text-center">'+noticia.titulo+'</h2>\
            <div id="contenidoNoticia" class="container">'+noticia.content+'</div>\
        </div>'
}

//APARTADO PARA CARGAR LOS MAPAS EN EL OFF-CANVAS
$(document).on('click', ".contMapa", function(){
    resetOffCanvas()

    let idMapa = $(this).attr("id")
    $.ajax({
        url: 'https://api.brawlapi.com/v1/maps/'+idMapa,
        dataType: 'json',
        success: function (datosRecogidos) {
            cargarMapaOffCanvas(datosRecogidos)
        },
        error: function () {
            console.log("Error al mostrar la información")
        }
    })
})

function cargarMapaOffCanvas(mapa){
    $('.offcanvas-header').css("background-color", mapa.gameMode.color)
    $('.offcanvas-title').text(mapa.name)
    $('.offcanvas-body').html(htmlMapaOffCanvas(mapa))
    htmlMejoresBrawlers(mapa.stats)
}

function htmlMapaOffCanvas(mapa){
    return '<img src="'+mapa.imageUrl+'" alt="" class="img w-100 pb-3">\
    <div>\
        <h3 class="textoBS-primary" >Modo de juego:&nbsp;\
            <span style="color:'+mapa.gameMode.color+';">'
                +mapa.gameMode.name+
            '</span>\
        </h3>\
    </div>\
    <div>\
        <h5 class="textoBS-primary text-warning">Mejores brawlers para este modo de juego:</h5>\
        <div class="container d-flex flex-column" id="mejoresBrawlers"></div>\
    </div>'
}

function htmlMejoresBrawlers(listaBrawlers){
    for(let i = 0; i < 10; i++){
        let idBrawler = listaBrawlers[i].brawler
        $.ajax({
            url: 'https://api.brawlapi.com/v1/brawlers/'+idBrawler,
            dataType: 'json',
            success: function (brawler) {
                $('#mejoresBrawlers').append(
                    '<div id="'+idBrawler+'" class="contBrawler mb-2" type="button" \
                    style="border: 2px solid'+brawler.rarity.color+'">\
                        <img src="'+brawler.imageUrl+'" class="img h-100">\
                        <span class="textoBS-primary">'+brawler.name+'</span>\
                    </div>'
                )
            },
            error: function () {
                console.log("Error al mostrar la información")
            }
        })
    }

}

//APARTADO PARA CARGAR LOS BRAWLERS EN EL OFF-CANVAS
$(document).on("click", ".contBrawler", function(){
    resetOffCanvas()

    let idBrawler = $(this).attr("id")
    $.ajax({
        url: 'https://api.brawlapi.com/v1/brawlers/'+idBrawler,
        dataType: 'json',
        success: function (datosRecogidos) {
            cargarBrawlerOffCanvas(datosRecogidos)
        },
        error: function () {
            console.log("Error al mostrar la información")
        }
    })
})

function cargarBrawlerOffCanvas(brawler){
    $('.offcanvas-header').css("background-color", brawler.rarity.color)
    $('.offcanvas-title').text(brawler.name)
    $('.offcanvas-body').html(htmlBrawlerOffCanvas(brawler))
    htmlHabilidadesBrawler(brawler)
}

function htmlBrawlerOffCanvas(brawler){
    return '<img src="'+brawler.imageUrl3+'" alt="" class="img w-50 pb-3">\
    <div class="textoBS-primary text-center">\
        <h3>Calidad:&nbsp;<span class="bordeLetras" style="color:'+brawler.rarity.color+';">'+brawler.rarity.name+'</span></h3>\
        <h3>Tipo:&nbsp;'+brawler.class.name+'</h3>\
        <h3>Descripción</h3>\
        <p class="w-100 textoBS-secondary fs-5">'+brawler.description+'</p>\
    </div>\
    <div id="gadget" class="textoBS-secondary">\
        <div class="d-flex justify-content-center align-items-center mb-2">\
            <img src="'+brawler.gadgets[0].imageUrl+'" class="img"><br>\
            <h3 class="textoBS-primary ms-2">Gadgets</h3>\
        </div>\
    </div>\
    <div id="starPower" class="textoBS-secondary">\
        <div class="d-flex justify-content-center align-items-center mb-2">\
            <img src="'+brawler.starPowers[0].imageUrl+'" class="img"><br>\
            <h3 class="textoBS-primary ms-2">Habilidades estelares</h3>\
        </div>\
    </div>'
}

function htmlHabilidadesBrawler(brawler){
    //Gadgets
    for(let i = 0; i < brawler.gadgets.length; i++){
        let gadget = brawler.gadgets[i]
        $('#gadget').append('\
        <h5>- '+gadget.name+'</h5>\
        <p>'+gadget.description+'</p>\
        ')
    }
    //Star Powers
    for(let i = 0; i < brawler.starPowers.length; i++){
        let starPower = brawler.starPowers[i]
        $('#starPower').append('\
        <h5>- '+starPower.name+'</h5>\
        <p>'+starPower.description+'</p>\
        ')
    }
}

//Limpiar el OffCanvas
function resetOffCanvas(){
    $('.offcanvas-header').css("background-color", "white")
    $('.offcanvas-title').text('')
    $('.offcanvas-body').html('<div class="d-flex justify-content-center">\
        <div class="spinner-border text-primary" role="status">\
        </div>\
    </div>')
}