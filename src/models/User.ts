import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryColumn()
  email: string;

  @Column()
  login: string;

  @Column()
  street: string;

  @Column()
  zipCode: string;

  @Column()
  country: string;
}
