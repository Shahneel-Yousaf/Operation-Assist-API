import { ApiProperty } from '@nestjs/swagger';
import { GroupInspectionFormSortByField, Order } from '@shared/constants';
import { IsEnum } from 'class-validator';

export class GetGroupInspectionFormOrderBy {
  @ApiProperty({
    description: 'Field order by of list group',
    example: GroupInspectionFormSortByField.INSPECTION_FORM_NAME,
    enum: GroupInspectionFormSortByField,
  })
  @IsEnum(GroupInspectionFormSortByField)
  field: GroupInspectionFormSortByField;

  @ApiProperty({
    description: 'Type order by of list group',
    example: Order.ASC,
    enum: Order,
  })
  @IsEnum(Order)
  order: Order;
}
