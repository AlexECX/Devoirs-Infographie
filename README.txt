QUICK START:
1 - Démarrez le webserver avec le start_python_server.bat, ou utilisez le
    webserver de votre choix.

2 - Ouvrir le répertoire avec le open_in_browser.bat, ou 127.0.0.1:#PORT/Travaux
     (Port 8009 par défaut). 

3 - Cliquez sur les differents htmls.

DÉROULEMENT:
1 - À l'ouverture d'un html, la fonction draw est appellé.

2 - La fonction draw effectue les appelles de fonction nécessaire à 
    l'initialisation de WebGL et des shaders. Elle instancie un objet SpaceShip qui
    contient le nécessaire au rendu du vaisseau spatiale et charge les différentes
    textures. 

3 - La fonction render est ensuite appellée une fois, puis à chaque fois qu'un listener
      est déclenché, mais le vaisseau sera rendu seulement après que toutes les textures
      aient été chargées. 


Modules Javascript ES6:
Ce projet utlise Javascript sous forme de modules (ou ECMAScript modules) disponible
depuis Javascript ES6 et implémenté dans tout les web browser principaux (ex. Edge, 
Firefox, Chrome, etc). Un module ne peut être démarrer depuis le navigateur de fichiers,
il doit être testé avec un web server.

Code Source:
Le code source est en Python, avec une utilisation libre de Javascript. Le tout est 
ensuite entièrement compilé/traduit en Javascript avec Transcrypt. Le code source 
Python est dans le dossier /python_src, le code JS compilé est dans /__target__.

