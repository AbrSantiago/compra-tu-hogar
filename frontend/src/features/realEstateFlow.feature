# language: es
Característica: Flujo Completo de Inmobiliaria

  Escenario: Registrar propiedad y publicarla de forma exitosa
    Dado que el usuario está en la página de login
    Cuando ingresa el usuario "remax@test.com" y la contraseña "123456"
    Y hace clic en el botón de ingresar
    Entonces debería ver el panel de la inmobiliaria
    
    Cuando navega a la sección de "Gestionar Inmuebles"
    Y registra una nueva propiedad con dirección "Av. Mitre 742", ubicación "Buenos Aires", tipo "Casa" y características "Gran jardín"
    Entonces la propiedad debería figurar en la lista de inmuebles

    Cuando navega a la sección de "Gestionar Publicaciones"
    Y publica el inmueble recientemente creado con un precio de "150000"
    Entonces la publicación debería figurar en la lista con estado Activo

    Cuando hace clic en el botón para volver al home público
    Entonces debería ver reflejada la publicación de "Av. Mitre 742" con el precio "USD 150.000"