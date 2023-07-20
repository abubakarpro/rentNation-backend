import { PartialType } from '@nestjs/swagger';
import { CreateDamageReportDto } from './create-damageReport.dto';

export class UpdateDamageReportDto extends PartialType(CreateDamageReportDto) {}
