import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Product } from "./Product";

@Entity()
export class ProductCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  taxRate: string;

  @Column()
  name: string;

  @OneToMany(() => Product, (p) => p.category)
  products: Product[];
}
