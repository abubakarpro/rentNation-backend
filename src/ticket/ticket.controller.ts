import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiParam, ApiProperty, ApiTags } from '@nestjs/swagger';

import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { RolesGuard } from 'src/users/auth/roles.guard';
import { Role } from 'src/users/dto/role.enum';

@Controller('ticket')
@ApiTags('Ticket Module')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get('getByUser/:id')
  @ApiParam({ name: 'id' })
  getAllTicketsByUser(@Param('id') id: string) {
    return this.ticketService.getAllTicketsByUser(id);
  }

  @Post()
  createTicket(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketService.createTicket(createTicketDto);
  }

  @Get()
  findAllTickets() {
    return this.ticketService.findAllTickets({});
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  findOneTicket(@Param('id') id: string) {
    return this.ticketService.findOneTicket(id);
  }

  // @UseGuards(AuthGuard('jwt'), new RolesGuard(Role.ADMIN))
  @Put(':id')
  @ApiParam({ name: 'id' })
  updateTicket(@Param('id') id: string, @Body() updateTicketDto: CreateTicketDto) {
    return this.ticketService.updateTicket(id, updateTicketDto);
  }

  // @UseGuards(AuthGuard('jwt'), new RolesGuard(Role.ADMIN))
  @Delete(':id')
  @ApiParam({ name: 'id' })
  removeTicket(@Param('id') id: string) {
    return this.ticketService.removeTicket(id);
  }
}
