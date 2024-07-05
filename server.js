const express = require("express");
const mongoose = require("mongoose");
const User = require("./model/User");
const Endpoint = require("./model/EndPoints");
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

const mongoUri = "mongodb://127.0.0.1:27017/demoDB";
mongoose.connect(mongoUri, {
  dbName: "demoDB",
});

const databaseConnections = {};

function createDatabaseConnection(dbName) {
  if (!databaseConnections[dbName]) {
    databaseConnections[dbName] = mongoose.createConnection(
      `mongodb://127.0.0.1:27017/${dbName}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  }
  return databaseConnections[dbName];
}

app.post("/create-database", async (req, res) => {
  const { dbName } = req.body;

  try {
    const newDb = createDatabaseConnection(dbName);

    const testCollection = newDb.model(
      "Test",
      new mongoose.Schema({ test: String })
    );
    await new testCollection({ test: "Database Created" }).save();

    res
      .status(201)
      .json({ message: `Database '${dbName}' created successfully.` });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create database.", error: error.message });
  }
});
app.post("/create-endpoint", async (req, res) => {
  const { name, route, method, tableName, dbName } = req.body;
  const newEndpoint = new Endpoint({ name, route, method });

  const userDb = createDatabaseConnection(dbName);
console.log(databaseConnections)

  await newEndpoint.save();
  const CollectionModel = userDb.models[tableName];

  res.status(201).json({
    message: `Endpoint ${name} created at route ${route} with method ${method}`,
  });

  app[method.toLowerCase()](route,async (req, res) => {
   let data= await CollectionModel.find()
    res.json(data);
  });
});
app.get("/list-databases", async (req, res) => {
  try {
    const admin = mongoose.connection.db.admin();
    const databases = await admin.listDatabases();

    res.status(200).json(databases.databases);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to list databases.", error: error.message });
  }
});
app.get("/", (req, res) => {
  res.send("Database Creator is running.");
});
app.post("/create-schema", async (req, res) => {
  const { dbName, schemaName, schemaDefinition } = req.body;

  try {
    const userDb = createDatabaseConnection(dbName);

    const newSchema = new mongoose.Schema(schemaDefinition);

    const CustomModel = userDb.model(schemaName, newSchema);

    res.status(201).json({
      message: `Schema '${schemaName}' created in database '${dbName}' successfully.`,
    });
  } catch (error) {
    console.error("Error creating schema:", error);
    res
      .status(500)
      .json({ message: "Failed to create schema.", error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
