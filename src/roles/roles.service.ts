import { Injectable } from '@nestjs/common';
import { Role } from './role.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role) private rolesRepository: typeof Role) {}

  async create(dto: CreateRoleDto): Promise<Role> {
    return this.rolesRepository.create(dto);
  }

  async getAll(): Promise<Role[]> {
    return this.rolesRepository.findAll();
  }

  async getOneByRole(role: string): Promise<Role> {
    return this.rolesRepository.findOne({ where: { role } });
  }

  async getOneById(id: number): Promise<Role> {
    return this.rolesRepository.findByPk(id);
  }
}
