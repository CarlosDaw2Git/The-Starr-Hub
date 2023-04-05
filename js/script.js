//Script principal de la página
$(document).ready(function(){
    $('#linkInicio').click(function(){
        window.location.reload()
    })

    //TODO
    $('#linkBrawlers').click(function(){
        $.ajax({
            type: 'GET',
            url: './content/brawlers.html',
            data: {},
            success: function(datosRecogidos){
                $('#contenidoWeb').html(datosRecogidos)
            }
        })
    })

    $('#linkPerfil').click(function(){
        
    })
})