import { ApiProperty } from '@nestjs/swagger';
import { Table, Model, Column, DataType, HasMany } from 'sequelize-typescript';
import { User } from 'src/users/user.model';

interface RoleCreationAttrs {
  role: string;
}

@Table({ tableName: 'roles' })
export class Role extends Model<Role, RoleCreationAttrs> {
  @ApiProperty({ example: 1, description: 'Role id' })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  })
  id: number;

  @ApiProperty({ example: 'User', description: 'Type of role' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  role: string;

  @HasMany(() => User)
  users: User[];
}
