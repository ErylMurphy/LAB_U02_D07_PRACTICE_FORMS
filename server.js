const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const dinosaurs = {};

const buildHTML = () => {
  return (
    "<html><head><style>img { max-width: 150px;}</style></head><body><h1>Dinoland</h1>" +
    Object.keys(dinosaurs).map(
      dinoIndex =>
        "<div><h2> ID " +
        dinoIndex.toString() +
        ": " +
        dinosaurs[dinoIndex].name +
        "</h2><img src='" +
        dinosaurs[dinoIndex].image_url +
        "' /></div>"
    ) +
    "</body></html>"
  );
};

app.get("/dinosaurs", (request, response) => {
  response.send(buildHTML());
});

app.get("/dinosaurs/new", (request, response) => {
  response.sendFile(path.join(__dirname, "index.html"));
});

app.get("/dinosaurs.json", (request, response) => {
  response.json(dinosaurs);
});

const getNextKey = object => {
  let index = 1;
  // debugger;
  while (index in object) {
    index++;
  }
  return index;
};

app.post("/dinosaurs", (request, response) => {
  console.log(request.body);
  const index = getNextKey(dinosaurs);
  if (!request.body.name || !request.body.image_url) {
    response
      .status(400)
      .send(
        "A dinosaur needs a name and an image_url passed in the request body."
      );
    return;
  }
  dinosaurs[index] = {
    name: request.body.name,
    image_url: request.body.image_url
  };
  return response.redirect(302, '/dinosaurs')
});

app.get("/dinosaurs/:id.json", (request, response) => {
  const id = Number(request.params.id);

  if (!id in dinosaurs) {
    response.status(404).send("There is no dinosaur with id " + id.toString());
    return;
  }

  response.json(dinosaurs[id]);
});

app.put("/dinosaurs/:id", (request, response) => {
  const id = Number(request.params.id);

  if (!id in dinosaurs) {
    response.status(404).send("There is no dinosaur with id " + id.toString());
    return;
  }

  if (request.body.name) {
    dinosaurs[id].name = request.body.name;
  }

  if (request.body.image_url) {
    dinosaurs[id].image_url = request.body.image_url;
  }

  response.status(200).send();
});

app.delete("/dinosaurs/:id", (request, response) => {
  const id = Number(request.params.id);

  if (!id in dinosaurs) {
    response.status(404).send("There is no dinosaur with id " + id.toString());
    return;
  }

  Reflect.deleteProperty(dinosaurs, id);
  response.send(200);
});

app.listen(5678, () => console.log("Example app listening on port 5678!"));
