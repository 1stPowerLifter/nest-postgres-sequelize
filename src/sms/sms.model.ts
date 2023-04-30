import { Table, Model, Column, DataType } from 'sequelize-typescript';

interface SmsCreationAttrs {
  phoneNumber: string;
  message: string;
}

@Table({ tableName: 'sms' })
export class Sms extends Model<Sms, SmsCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phoneNumber: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  message: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: false,
  })
  status: string;
}
