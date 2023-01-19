# INF3995-103
---------------------------------------------------------------------------------------------------


# Les conventions de codages.

Le client utilise la convention : Angular styles.  
Le server utilise la convention : Pep8.   
La simulation utilise la convention : Google Style.  
Le code embarqué (firmware) utilise la convention : Google Style.  



# Compiler le projet

Pour compiler le project sur localhost: 
 Naviguer dans le dossier "project".

 1) Dans le dossier client :
 	--> Il faut que node.js et angular soient installés.
 	
 	1. npm install
 	   --> si ceci ne fonctionne pas, essayer : npm install --force
 	2. npm start 
 	
  2) Dans le dossier serveur :
    --> Il faut avoir python3 et pip d'installer.
         
  	1. Pour installer les prérequis, il faut utiliser la commande : 
  		pip install -r requirements.txt
  		
  	2. partir le serveur : python3 run.py
  	
  3) Dans le dossier simulation :
  
  	--> Il faut avoir argos3 et cmake d'installer.
  	
  	1. mkdir build
  	2. cd build
  	3. cmake..
  	4. make
  	5. cd.. 
  	6. argos3 -c experiments/crazyflie_sensing.argos 



# Docker
Pour utiliser le project avec docker :  
 --> Avoir docker et docker-compose d'installer.  
   1) Pour compiler le projet au complet : 
	  docker-compose up --build

