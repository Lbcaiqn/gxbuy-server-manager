import { IsNotEmpty, IsString, IsNumber, IsObject, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger/dist';

class SalesAttrsDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: '分类' })
  name: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  values: Array<string>;
}

export class CreateGoodsSpuDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: '商品名' })
  goodsSpuName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: 'https://xxx' })
  goodsSpuMainImg: string;

  @IsNotEmpty()
  @IsArray()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @ApiProperty({ type: Array<SalesAttrsDto>, example: [{ name: '颜色', values: ['黑色', '红色'] }] })
  spuSalesAttrs: Array<SalesAttrsDto>;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ type: Array<string>, example: ['https:/xxx', 'https://yyy'] })
  bannerImgList: Array<string>;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ type: Array<string>, example: ['https:/xxx', 'https://yyy'] })
  detailImgList: Array<string>;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, example: 1 })
  c1id: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, example: 1 })
  c2id: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, example: 1 })
  c3id: number;
}
