let datosNoticias
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
            datosNoticias = datosRecogidos
            cargarNoticias(datosNoticias)
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
            //console.log(datosRecogidos.active[0])
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
        <div class="evento textoBS-primary">\
            <div class="text-bg-dark text-light text-end w-100 pe-3 fs-6 fs-lg-5">\
                El evento termina en: <span class="text-gray">'+ getTiempoRestante(evento.endTime) + '</span>\
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

//APARTADO PARA CARGAR LAS NOTICIAS
function cargarNoticiaMain(titulo){
    lightLink($('#linkNoticias'))

    for (let i = 0; i < datosNoticias.noticias.length; i++){
        let noticia = datosNoticias.noticias[i]
        if(noticia.titulo == titulo){

            $('#contenidoWeb').html(htmlNoticiaMain(noticia))
        }
    }
}

function htmlNoticiaMain(noticia){
    return '<div class="container noticiaMain" style="background-image: url(./img/'+noticia.img+');"></div>\
        <div class="mt-3">\
            <h2 class="titulo textoBS-primary text-center">'+noticia.titulo+'</h2>\
            <div id="contenidoNoticia" class="container">'+noticia.content+'</div>\
        </div>'
}