l3o2
====

Projet L3o2 2013

Introduction:
-------------

Ce projet est réalisé dans le cadre des projets de programmation de Licence 3 de l'UFR Mathématiques-Informatique de l'Université Paris 5 Descartes au titre de projet fin d'étude. 
L'objectif principal du projet est de développer une application web permettant à un utilisateur de localiser des salles de concerts à proximité  et d’avoir accès à leurs programmations. Pour cela, nous utiliserons les données des salles de concerts incluant leurs programmations grâce aux APIs du site lastfm et nous les situerons sur un plan pour ensuite pouvoir les géo-localiser à l’aide de l’outil  GoogleMaps. Par ailleurs, les données seront intégrées dans le Mongodb il s'agit d'un système de base de données qui stocke et qui recherche les salles de concert en  géo-spatial.


Aide d'utilisation:
Fichier necessaire: `server.js`, `node-mongodb.js`, `req-json-lastfm.js`, `newpage.html`.

Dependencies: `mongodb`, `request`, `http`, `util` et `querystring`.

La classe `req-json-lastfm.js` recupere certains informations selectionnée des concerts en utilisant son API JSON `Geo.getEvents` du site `lastfm.com`, comme: le titre, les artistes, l'adresse, l'url de ce concert sur le site `lastfm.com` et le siteweb du concert lui meme. Egalement, `req-json-lastfm.js` stock ces informations dans un fichier `.json`. Ainsi il fait `exports` d'une variable qui contients ces informations en JSON, et une autre qui contient simplement les memes informations mais sous forme HTML.

Utilisation `server.js`:
on peut lancer le serveur avec la command sous Terminal: `node-server.js`
