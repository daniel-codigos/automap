# 1. **Descripción**
Llevo varios años desarrollando un proyecto para automatizar la gestión de devolución de servicios finalizados bajo la plataforma de Infocol de Mapfre, de forma privada para una empresa. Empezó siendo un script de consola para ahorrar tiempo en clicks. Finalmente ha acabado siendo una app que interpreta la descripción de los servicios ya realizados y en funcion de lo interpretado carga una serie de importes. Es capaz de diferenciar entre múltiples tipos de servicio.

Mediante peticiones (POST y GET) obtiene la lista de servicios realizados, interpreta las descripciones de trabajo y genera los importes correspondientes. Con Web scrapping irá finalizando cada serivicio realizado cargando cada importe. Así finalmente queda una app que el usuario final solo debe revisar los importes cargados y modificar en caso de fallo con una sencilla aplicación pensada para el usuario (pocos clicks). Actualmente el "cerebro", la parte de backend que modifica el texto para dejarlo mas sencillo; hasta el diccionario con "palabras clave" y sus respectivos importes funcionan de forma correcta en un 80% de los casos. Para terminar de mejorarlo actualmente estoy entrenando un modelo de ML para implementarlo de "cerebro" y tratar de mejorar el % de correctos.

 El proceso de web scrapping para finalizar cada parte de trabajo es una tarea lenta que puede tardar al rededor de 20 minutos, por ello implementé channels para ser consciente en todo momento del proceso y enseñar el monto de finalizados, Ej: 5/22.

# 2. **Instalación**
Requsitos:
 - java 17, node 17/18
Instalación:
```
npm install -g yarn
```
```
yarn install
yarn android
```
o
```
npm install
npm android
```

# 3. **Configuración**
Despues de lanzar
```
yarn android
```
Cuando termina deberiamos ver la carpeta de android generada. Añadimos en el sigueinte archivo:
```
android/app/src/main/AndroidManifest.xml
```
Buscamos la etiqueta "application" y le añadimos lo siguiente:
```
android:usesCleartextTraffic="true"
```
Debería quedar algo asi:
```
<application android:name=".MainApplication" android:usesCleartextTraffic="true" android:label="@string/app_name" android:icon="@mipmap/ic_launcher" android:roundIcon="@mipmap/ic_launcher_round" android:allowBackup="true" android:theme="@style/AppTheme">
```

El archivo que contiene la direccion de la API es ips.json el espacio de "elegido".
```
{
    "ips":{
        "elegido":"TU-IP:8000",
    }
}
```
# 4. **Run app**
Para ejecutar la app debemos ejecutar
```
yarn start
```
Y tenemos diferentes opciones:
 1. Usar Expo Go con un dispositivo fisico, meidante USB o WiFi mediante IP.
 2. Usar un emulador android (android studio / android studio command line tools)

