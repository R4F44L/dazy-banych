import express from "express";
import { DataSource } from "typeorm";
import { User } from "./models/User";

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "postgres",
  synchronize: true,
  logging: true,
  entities: [User],
  subscribers: [],
  migrations: [],
});
const app = express();
const port = 4000;

AppDataSource.initialize()
  .then(() => {
    app.get("/", (req, res) => {
      res.send("Helloeqweq World!");
    });

    app.listen(port, () => {
      console.log("elo2");
    });

    console.log("siemea");
    // here you can start to work with your database
  })
  .catch((error) => console.log(error));
