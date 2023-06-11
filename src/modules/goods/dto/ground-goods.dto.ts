import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GroundGoodsDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: '1' })
  goodsSkuId?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, example: '1' })
  goodsSpuId?: string;

  @IsBoolean()
  @ApiProperty({ type: Boolean, example: true })
  ground: boolean;
}
