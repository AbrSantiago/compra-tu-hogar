# language: es
Característica: Inicio de Sesión de Usuarios

  Escenario: Inicio de sesión exitoso con credenciales válidas
    Dado que el usuario está en la página de login
    Cuando ingresa el usuario "ana@test.com" y la contraseña "123456"
    Y hace clic en el botón de ingresar
    Entonces debería ver el home con su sesión iniciada