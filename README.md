If docker-compose up fail with

npm ERR! code EAI_AGAIN
npm ERR! errno EAI_AGAIN
npm ERR! request to https://registry.npmjs.org/react-scripts failed, reason: getaddrinfo EAI_AGAIN registry.npmjs.org

Just restart docker

sudo service docker restart