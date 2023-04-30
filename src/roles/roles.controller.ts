import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { Role } from './role.model';
import { CreateRoleDto } from './dto/create-role.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Roles')
@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RolesController {
  constructor(private rolesServise: RolesService) {}

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 200, type: Role })
  @Post()
  async create(@Body() dto: CreateRoleDto): Promise<Role> {
    return this.rolesServise.create(dto);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: [Role] })
  @Get()
  async getAll(): Promise<Role[]> {
    return this.rolesServise.getAll();
  }

  @ApiOperation({ summary: 'Get by role' })
  @ApiResponse({ status: 200, type: Role })
  @Get('/:role')
  async getOneByRole(@Param('role') role: string): Promise<Role> {
    return this.rolesServise.getOneByRole(role);
  }
}
