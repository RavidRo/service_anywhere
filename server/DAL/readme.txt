in package.json i changed - "start": "tsc && node build/server/Network/RequestHandler.js",
to index.js for testing the db 


need to install sqlite - npm install sqlite --save 

in ormconfig.json - 
need to make sure  the value of "entities":[".../**/*.js"] is the correct relative path to where the code is running