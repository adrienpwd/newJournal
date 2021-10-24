When you run the app for the first time you need to insert this user to the DB

$ docker exec -it mongodb bash $ mongo -u mongodbuser -p **** $ db.createUser({ user: 'flaskuser', pwd: '****', roles: [ { role: 'readWrite', db: 'flaskdb' } ] })

Then create 'flaskdb' and insert the user 'flaskuser'

Important !
process.env.REACT_APP_USERS_SERVICE_URL has to be set to "http://localhost:5001" Need to be do (root of the project)

For DEV env:
$ export REACT_APP_USERS_SERVICE_URL=http://localhost:5001


For PROD env:
$ export REACT_APP_USERS_SERVICE_URL=http://192.168.1.70:5001 Make sure the IP of the server (Intel NUC computer) didn't change


Errors with uploading images ?
RUN:
$ sudo chown adrien:adrien -R tradeLogs

Errors while installing packages ?
RUN:
$ sudo service docker restart