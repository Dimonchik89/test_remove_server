import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateDeviceDto {
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  serialNumber: string;

  @IsOptional()
  deviceName: string;
}
