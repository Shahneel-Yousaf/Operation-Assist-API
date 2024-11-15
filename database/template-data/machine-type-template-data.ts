import { QueryRunner } from 'typeorm';

import { insertOrUpsertTable } from '../commons/functions';

export const machineTypeTemplateData = async (queryRunner: QueryRunner) => {
  const data: {
    machine_type_id: string;
    machine_type_code: string;
    type_name: string;
    picture_url: string;
  }[] = [
    {
      machine_type_id: '0661J7JX5D7J7BH8MS4M14KEEW',
      machine_type_code: 'HE',
      type_name: 'CRAWLER EXCAVATOR',
      picture_url: 'machine_types/crawler_excavator_default.jpg',
    },
    {
      machine_type_id: '0661J7JX5DGBT31R2WD1TSC4PM',
      machine_type_code: 'WL',
      type_name: 'WHEEL LOADER',
      picture_url: 'machine_types/wheel_loader_default.jpg',
    },
    {
      machine_type_id: '0661J7JX5DSNHWH21EZZVBJ150',
      machine_type_code: 'CT',
      type_name: 'CRAWLER DOZER',
      picture_url: 'machine_types/crawler_dozer_default.jpg',
    },
    {
      machine_type_id: '0661J7JX5DXH6E3YD3KC9EAJHG',
      machine_type_code: 'RDT',
      type_name: 'RIGID DUMP TRUCK',
      picture_url: 'machine_types/rigid_dump_default.jpg',
    },
    {
      machine_type_id: '0661J7JX5EAFPV1FFBPZ62YA88',
      machine_type_code: 'ADT',
      type_name: 'ARTICULATED DUMP TRUCK',
      picture_url: 'machine_types/arti_dump_default.jpg',
    },
    {
      machine_type_id: '0661J7JX5EM9EHA53YEV7SRE8M',
      machine_type_code: 'MG',
      type_name: 'MOTOR GRADER',
      picture_url: 'machine_types/motor_grader_default.jpg',
    },
    {
      machine_type_id: '0661J7JX6W3970X6PDHTA7SX38',
      machine_type_code: 'WHE',
      type_name: 'WHEEL EXCAVATOR',
      picture_url: 'machine_types/wheel_excavator_default.jpg',
    },
    {
      machine_type_id: '0661J7JX6W4JGWN8QRHV6GHWFG',
      machine_type_code: 'FL',
      type_name: 'FORKLIFT',
      picture_url: 'machine_types/forklift_default.jpg',
    },
    {
      machine_type_id: '0661J7JX6WXCVEWV3CGVZ3QJEM',
      machine_type_code: 'BHL',
      type_name: 'BACKHOE LOADER',
      picture_url: 'machine_types/backhoe_loader_default.jpg',
    },
    {
      machine_type_id: '0661J7JX6X9XGHBZTQJGTQXBDM',
      machine_type_code: 'SSL',
      type_name: 'SKID STEER LOADER',
      picture_url: 'machine_types/skid_steer_loader_default.jpg',
    },
    {
      machine_type_id: '0661J7JX6YB8MWJ7H0NKA2QAKW',
      machine_type_code: 'MC',
      type_name: 'MOBILE CRUSHER',
      picture_url: 'machine_types/mobile_crusher_default.jpg',
    },
    {
      machine_type_id: '0661J7JX6ZDP4HXM46349GPFHW',
      machine_type_code: 'OTHERS',
      type_name: 'Others',
      picture_url: 'machine_types/others_default.jpg',
    },
  ];

  await insertOrUpsertTable(
    queryRunner,
    'machine_types',
    ['machine_type_id'],
    data,
  );
};
