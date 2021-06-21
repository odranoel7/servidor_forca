# servidor_forca
## Requisito **ter o npm instalado**.  
  
## Para rodar a versão V1.0:
* Clonar a tag v1.0 do projeto.
* npm install
* npm run server  
  
## Paa rodar a versão V2.0:  
* Clonar a tag v2.0 do projeto.
* npm install  
* npm run websockets  
  
## Para rodar a versão v4.0:
* Clonar a tag v4.0 do projeto.
* npm install  
* **Necessita ter o docker instalado, ou instalar o RabbitMQ**
* docker run -d --hostname my-rabbit --name some-rabbit --rm -p 8080:15672 -p 5672:5672 rabbitmq:3-management
* npm run mq