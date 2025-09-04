import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

type CreateUserDto = {
  name: string;
  email: string;
  password: string;
  status?: string;
}

type UpdateUserDto = {
  name?: string;
  email?: string;
  status?: string;
}

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findById(id);
  }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return await this.usersService.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return await this.usersService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(id);
  }

  @Get('top3')
  async top3() {
    return await this.usersService.top3();
  }

  @Patch(':id/active')
  async toggleActive(@Param('id') id: string, @Body() { active }: { active: boolean }) {
    let sts = "Not Active"
    if (active) sts = "Active"
    return await this.usersService.toggleActive(id, sts);
  }
}
