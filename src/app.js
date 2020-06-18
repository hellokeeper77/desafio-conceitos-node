const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");
const { response } = require("express");

const app = express();

app.use(express.json());
app.use(cors());

function checkID(request, responde, next) {
  const { id } = request.params

  if (!isUuid(id)) {
    return response.status(400).send({ error: "ID Not Found!" })
  }

  return next()
}


const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {

  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }
  repositories.push(repository)
  return response.json(repository)
});

app.put("/repositories/:id", checkID, (request, response) => {

  const { id } = request.params

  const { title, url, techs } = request.body

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0) {
    return response.status(404).response.json({ message: "Repository not found!" })
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: 0
  }

  repositories[repositoryIndex] = repository

  return response.json(repository)
});

app.delete("/repositories/:id", checkID, (request, response) => {

  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0) {
    return response.status(404).response.json({ message: "Repository not found!" })
  }

  repositories.splice(repositoryIndex, 1)

  return response.status(204).json()
});

app.post("/repositories/:id/like", checkID, (request, response) => {

  const { id } = request.params


  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0) {
    return response.status(404).response.json({ message: "Repository not found!" })
  }

  const oldRepository = repositories[repositoryIndex]

  const repository = {
    ...oldRepository,
    likes: oldRepository.likes + 1
  }

  repositories[repositoryIndex] = repository

  return response.json(repository)


});

module.exports = app;