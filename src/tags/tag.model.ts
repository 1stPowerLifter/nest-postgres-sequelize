import {
  Table,
  Model,
  Column,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { PostTag } from 'src/post-tags/post-tag.model';
import { Post } from 'src/posts/post.model';

interface TagCreationAttrs {
  name: string;
}

@Table({ tableName: 'tags' })
export class Tag extends Model<Tag, TagCreationAttrs> {
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
    unique: true,
  })
  name: string;

  @BelongsToMany(() => Post, () => PostTag)
  posts: Post[];
}
