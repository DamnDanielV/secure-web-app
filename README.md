# secure-web-app

## Descripcion

Servicio web para la administracion de un negocio el cual ofrece una serie de productos separados en categorias a sus clientes.

El backend está encargado de proporcionar la seguridad necesaria para realizar consultas y operaciones en la base de datos, implementando el uso de roles (administardor y usuario) e implementado Json Web Tokens para la autenticación y autorización de los usuarios del aplicativo, asi como la encriptación de la contraseña de dichos usuarios, adicionalmente y si el usuario asi lo desea puede realizar el login por medio de su cuenta de Google, haciendo uso del API que Google dispone para dicho servicio.

El frontend posteriormente se conectará al servicio a los endpoints que dispone el backend (RestApi) y hará las consultas necesarias para mostrar la informacion requerida por el cliente.


Este servicio está alojado en Heroku con los respectivos certificados SSL y con variables de entorno configuradas que aumentan la seguridad en general.

### Tecnologias aplicadas

- Base de datos: MongoDb
- Backend: NodeJs
- Json Web Tokens
- Google Auth
- Express
- RestApi
- Mongoose
- entre otras...

