# language: es
Característica: Flujo Completo de Administración

  Escenario: Edición y gestión de datos por parte del Administrador
    Dado que el usuario está en la página de login
    Cuando ingresa el usuario "admin@test.com" y la contraseña "123456"
    Y hace clic en el botón de ingresar
    Entonces debería ver el panel de administración

    Cuando navega a la sección de "Inmuebles"
    Y edita la propiedad con dirección "Alem 60" cambiando el tipo a "Casa" y dirección a "Alem 61"
    Entonces la propiedad debería mostrar la dirección "Alem 61" y tipo "Casa" en la tabla

    Cuando navega a la sección de "Publicaciones"
    Y edita la publicación de la propiedad "Alem 61" cambiando el precio a "175000" y estado a "Pausado"
    Entonces la publicación debería reflejar el precio "USD 175.000" y estado "Pausado" en la propiedad "Alem 61"

    Cuando hace clic en el botón de eliminar la publicación de "Alem 61"
    Y confirma la eliminación
    Entonces la publicación de "Alem 61" no debería figurar en la lista