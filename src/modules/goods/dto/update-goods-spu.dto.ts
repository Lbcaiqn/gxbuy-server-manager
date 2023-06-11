import { CreateGoodsSpuDto } from './create-goods-spu.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger/dist';

export class UpdateGoodsSpuDto extends CreateGoodsSpuDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: '1' })
  goodsSpuId: string;
}
