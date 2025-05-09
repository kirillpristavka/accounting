import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

export class Organization extends Model {
  public id!: number;
  public view!: string;
  public status!: string;
  public surname!: string;
  public name!: string;
  public patronymic!: string;
  public fullName!: string;
  public prefix!: string;
  public inn!: string;
  public ogrnip!: string;
  public registrationDate!: string;
  public certificate!: string;
  public certificateDate!: string;

  public bank!: object;
  public address!: object;
  public taxInspection!: object;
  public pension!: object;
  public fss!: object;
  public statistics!: object;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Organization.init({
  view:             { type: DataTypes.STRING, allowNull: false },
  status:           { type: DataTypes.STRING, allowNull: false },
  surname:          { type: DataTypes.STRING, allowNull: false },
  name:             { type: DataTypes.STRING, allowNull: false },
  patronymic:       { type: DataTypes.STRING, allowNull: false },
  fullName:         { type: DataTypes.STRING, allowNull: false },
  prefix:           { type: DataTypes.STRING, allowNull: true },
  inn:              { type: DataTypes.STRING, allowNull: false, unique: true },
  ogrnip:           { type: DataTypes.STRING, allowNull: true },
  registrationDate: { type: DataTypes.DATEONLY, allowNull: true },
  certificate:      { type: DataTypes.STRING, allowNull: true },
  certificateDate:  { type: DataTypes.DATEONLY, allowNull: true },

  bank:             { type: DataTypes.JSONB, allowNull: true },
  address:          { type: DataTypes.JSONB, allowNull: true },
  taxInspection:    { type: DataTypes.JSONB, allowNull: true },
  pension:          { type: DataTypes.JSONB, allowNull: true },
  fss:              { type: DataTypes.JSONB, allowNull: true },
  statistics:       { type: DataTypes.JSONB, allowNull: true },
}, {
  sequelize,
  tableName: "organizations",
});
