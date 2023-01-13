import bodyParser from "body-parser";
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
app.use(bodyParser.json());
const port = 4000;

AppDataSource.initialize()
  .then((source) => {
    app.get("/", (req, res) => {
      res.send("Helloeqweq World!");
    });

    app.listen(port, () => {
      console.log("elo2");
    });

    app.get("/genData/:iterations", (req, res) => {
      const result: any[] = [];

      for (let i = 0; i < Number(req.params.iterations); i++) {
        result.push({
          email: "email@email.com" + i,
          login: "login",
          zipCode: "10-100",
          country: "POL",
          street: "Białostocka",
        });
      }

      res.send(result);
    });

    app.get("/users", (req, res) => {
      source
        .getRepository(User)
        .createQueryBuilder("user")
        .getMany()
        .then((data) => res.send(data));
    });

    app.post("/users", (req, res) => {
      // console.log(req.body);
      source
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(req.body)
        .execute()
        .then((data) => res.send(data));
    });

    app.put("/users/:zipCode", (req, res) => {
      // console.log(req.body);
      source
        .createQueryBuilder()
        .update(User)
        .set({
          email: () => "email",
          login: "newlogin",
          zipCode: "100-100",
          country: "GB",
          street: "Białostocka",
        })
        .where("zipCode = :zipCode", { zipCode: req.params.zipCode })
        .execute()
        .then((data) => res.send(data));
    });

    app.delete("/users/:zipCode", (req, res) => {
      // console.log(req.body);
      source
        .createQueryBuilder()
        .delete()
        .from(User)
        .where("zipCode = :zipCode", { zipCode: req.params.zipCode })
        .execute()
        .then((data) => res.send(data));
    });

    // here you can start to work with your database
  })
  .catch((error) => console.log(error));
