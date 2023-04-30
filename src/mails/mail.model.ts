import { Table, Model, Column, DataType } from 'sequelize-typescript';

interface MailCreationAttrs {
  email: string;
  text: string;
  subject: string;
  html: string;
}

@Table({ tableName: 'mails' })
export class Mail extends Model<Mail, MailCreationAttrs> {
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
    validate: {
      isEmail: true,
    },
  })
  email: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  text: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  subject: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  html: string;
}
