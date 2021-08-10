# Calendar

This is a calendar application to manage reminders. It comprises of two separate apps, a backend built with **Ruby on Rails** and a frontend built with **React**.

## Demo

There is a demonstration deployed at http://50.18.100.6/

## Installation

This project uses **docker** and **docker-compose** to build all infrastructure. You will need both installed.

First configure ports in **.env** file, locate in root folder. Default values are shown bellow.

```bash
ORIGIN_IP=localhost
API_PORT=3010
FRONTEND_PORT=80
```

Then build infrastructure and apps with the provided script 

```bash
./scripts/prod/install.sh
```

It will take some time for all the building to finish. After it's done you can access the app at the configured URL. 

eg. http://localhost 


## License
GNU General Public License v3.0
