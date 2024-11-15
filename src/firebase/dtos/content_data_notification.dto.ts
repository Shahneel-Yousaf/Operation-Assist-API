import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class ContentDataNotification {
  @Expose({ name: 'action_by_user_id' })
  @IsString()
  actionByUserId: string;

  @Expose({ name: 'given_name' })
  @IsString()
  givenName: string;

  @Expose({ name: 'surname' })
  @IsString()
  surname: string;

  @Expose({ name: 'group_id' })
  @IsString()
  groupId: string;

  @Expose({ name: 'group_name' })
  @IsString()
  groupName: string;

  @Expose({ name: 'machine_id' })
  @IsString()
  machineId: string;

  @Expose({ name: 'customer_machine_name' })
  @IsString()
  customerMachineName?: string;

  @Expose({ name: 'custom_inspection_form_id' })
  @IsString()
  customInspectionFormId?: string;

  @Expose({ name: 'custom_inspection_form_name' })
  @IsString()
  customInspectionFormName?: string;

  @Expose({ name: 'machine_report_id' })
  @IsString()
  machineReportId?: string;

  @Expose({ name: 'machine_report_response_id' })
  @IsString()
  machineReportResponseId?: string;

  @Expose({ name: 'inspection_id' })
  @IsString()
  inspectionId?: string;
}
