import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';
import { Category } from 'src/categories/category.model';
import { PostTag } from 'src/post-tags/post-tag.model';
import { Tag } from 'src/tags/tag.model';
import { User } from 'src/users/user.model';

interface PostCreationAttrs {
  title: string;
  content: string;
}

@Table({ tableName: 'posts' })
export class Post extends Model<Post, PostCreationAttrs> {
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
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  content: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
    defaultValue: null,
  })
  categoryId: number;

  @BelongsTo(() => Category)
  category: Category;

  @BelongsToMany(() => Tag, () => PostTag)
  tags: Tag[];
}
