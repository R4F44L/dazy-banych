import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import { UserModel } from "./models/mongoose/User";
import { DataSource } from "typeorm";
import { User } from "./models/User";
import Realm from "realm";
import { RealmUser } from "./models/realm/User";

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
    // mongoose
    mongoose
      .connect(
        "mongodb://mongo:mongo@localhost:27017/mongoose?authSource=admin"
      )
      .then(() => {
        app.get("/mongoose/users", async (req, res) => {
          const allUsers = await UserModel.find();
          return res.status(200).json(allUsers);
        });
        app.post("/mongoose/users", async (req, res) => {
          const created = await UserModel.create(req.body);
          return res.status(200).json(created);
        });
        app.put("/mongoose/users/:zipCode", async (req, res) => {
          const updated = await UserModel.collection
            .initializeOrderedBulkOp()
            .find({ zipCode: req.params.zipCode })
            .update(
              !req.body?.login
                ? {
                    $set: {
                      login: "newlogin",
                      // zipCode: "100-100",
                      country: "GB",
                      street: "Białostocka",
                    },
                  }
                : { $set: req.body }
            )
            .execute();
          return res.status(200).json("updated");
        });
        app.delete("/mongoose/users/:zipCode", async (req, res) => {
          const updated = await UserModel.collection
            .initializeOrderedBulkOp()
            .find({ zipCode: req.params.zipCode })
            .delete()
            .execute();
          return res.status(200).json("deleted");
        });
      });

    // postgres
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

    // realm
    Realm.open({
      inMemory: true,
      schema: [RealmUser],
    }).then((realm) => {
      app.get("/realm/users", async (req, res) => {
        const objects = realm.objects("User");
        console.log("objects", (objects?.[0] as any)?.email);

        res.send("retrieved");
      });
      app.post("/realm/users", async (req, res) => {
        // const realm = await Realm.open({
        //   path: "default.realm",
        //   schema: [RealmUser],
        // });

        let user;
        realm.write(() => {
          user = realm.create("User", req.body);
        });

        console.log("user", { login: user.login });

        res.send(user.email);
      });
    });

    //defaults
    app.get("/", (req, res) => {
      res.send("Postman");
    });
    app.listen(port, () => {});
  })
  .catch((error) => console.log(error));
