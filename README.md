# Proyecto de residencias

Este proyecto es una aplicación desarrollada en React con NextJS y TypeScript.

## Requisitos

Para poder ejecutar este proyecto, se requiere lo siguiente:

- MySQL Workbench con MySQL Server instalado.
  > Durante la instalación de MySQL Workbench, al llegar a la configuración del MySQL Server, asegúrese de seleccionar la opción "Use Legacy Authentication Method" en la sección de métodos de autenticación, ya que el módulo MySQL para React aún no es compatible con el nuevo método de autenticación.

- Node.js instalado.

- Visual Studio Code o cualquier otro editor de código instalado.

## Cómo ejecutar este proyecto

Siga los pasos a continuación para ejecutar este proyecto:

1. En MySQL Workbench, desactive la opción "Safe Updates" en Edit > Preferences > SQL Editor.

2. Descargue el proyecto desde [releases](https://github.com/ricardoruva/ProtoApp/releases), descomprímalo y abra la carpeta con Visual Studio Code.

3. Cree un archivo en la raíz del proyecto llamado "local.config.js" y copie el siguiente código, modificando los valores que están comentados:

```js
// local.config.js

function connectionDatabase() {
	const DBPASSWORD = 'password'; // Inserte aquí la contraseña de su instancia local.
	const DBPORT = 3306; // Inserte aquí el puerto utilizado por MySQL Server. Actualmente, se encuentra configurado con el valor por defecto. Si no lo ha modificado, déjelo así.
	
	return {
		DBPASSWORD,
		DBPORT
	}
}

function sessionAuthSecurity() {
	const amountHashSalt = 10; // Inserte aquí la cantidad de salt que desea que tenga el hash de las contraseñas y del sessionAuth. El número por defecto es el recomendado.
	const sessionAuthMultiplier = 30; // Este es el multiplicador del número generado para el sessionAuth. El número por defecto es el recomendado.

	return {
		amountHashSalt,
		sessionAuthMultiplier,
	};
}

module.exports = { connectionDatabase, sessionAuthSecurity };
```

4. Ejecute el siguiente comando para instalar todos los módulos necesarios para el funcionamiento de la aplicación:

```bash
npm install
```

5. A continuación, ejecute el siguiente script para crear todo lo necesario para el funcionamiento de la aplicación:

```bash
npm run setup
```

6. Inicie la aplicación con el siguiente comando:

```bash
npm run dev
```

> La aplicación se iniciará en el puerto http://localhost:3000/.
