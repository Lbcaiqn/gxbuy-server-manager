import { IsNotEmpty, IsString, IsNumber, IsObject, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger/dist';

class SalesAttrsDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: '分类' })
  name: string;

  @IsNotEmpty()
  @IsString({ each: true })
  value: string;
}

export class CreateGoodsSkuDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: '商品名' })
  goodsSkuName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: 'https://xxx' })
  goodsSkuImg: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: '99' })
  goodsSkuPrice: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, example: 100 })
  goodsSkuStock: number;

  @IsNotEmpty()
  @IsArray()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @ApiProperty({ type: Array<SalesAttrsDto>, example: [{ name: '颜色', value: '黑色' }] })
  skuSalesAttrs: Array<SalesAttrsDto>;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: '1' })
  goodsSpuId: string;
}
