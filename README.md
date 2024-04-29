# SE Frontend Application
FH Campus Wien - SDE - Service Engineering - Final Project Part 2

This project contains the frontend application which is served using Nginx within a Docker container. Follow the instructions below to build and run the application.

## Prerequisites

Before you begin, ensure you have installed:
- [Docker](https://www.docker.com/get-started)

## Setup Instructions

### Building the Docker Image

To build the Docker image for the frontend application, run the following command from the root of the project directory:

```bash
docker build -t se-frontend-service .
```

### Running the Docker Container
Once the image is built, you can run it as a Docker container with the following command:

```bash
docker run -d --name se-frontend -p 9095:9095 se-frontend-service
```
This command starts a container named se-frontend, mapping port 9095 on the host to port 9091 on the container. The application will now be accessible through http://localhost:9095/.

### Checking Logs

To view the logs from the Nginx server within the Docker container, you can use the following command:
```bash
docker logs se-frontend
```
### Stopping the Container

To view the logs from the Nginx server within the Docker container, you can use the following command:
```bash
docker stop se-frontend
```
### Removing the Container

And to remove the container, once stopped:

```bash
docker rm se-frontend
```
