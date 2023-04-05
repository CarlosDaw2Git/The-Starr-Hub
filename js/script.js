//Script principal de la página
$(document).ready(function(){
    $('#linkInicio').click(function(){
        window.location.reload()
    })
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
})