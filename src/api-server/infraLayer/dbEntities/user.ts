import { Column, Entity, PrimaryColumn } from "typeorm";
import { BaseModel } from "./baseModel";

@Entity({
  name: "user",
})
export class User extends BaseModel {
  @PrimaryColumn()
  account!: string;

  @Column()
  password!: string;

  @Column()
  name!: string;
}
