import { CreateGoodsSkuDto } from './create-goods-sku.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger/dist';

export class UpdateGoodsSkuDto extends CreateGoodsSkuDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: '1' })
  goodsSkuId: string;
}
