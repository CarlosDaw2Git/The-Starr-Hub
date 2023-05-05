//Script para acceder a las cookies

function comprobarCookie(nombreCookie){
    arrCookies = document.cookie.split("; ")
    for (let i = 0; i < arrCookies.length; i++) {
        cookie = arrCookies[i].split("=")
        if(nombreCookie == cookie[0]){
            return true
        }
        
    }
    return false
}

function getValorCookie(nombreCookie){
    arrCookies = document.cookie.split("; ")
    for (let i = 0; i < arrCookies.length; i++) {
        cookie = arrCookies[i].split("=")
        if(nombreCookie == cookie[0]){
            return cookie[1]
        }
    }
    return null
}

function crearCookie(nombreCookie, valorCookie){
    document.cookie = nombreCookie+"="+valorCookie+";max-age=999999999;"
}

function borrarCookie(nombreCookie){
    document.cookie = nombreCookie+"=;max-age=0;"
}