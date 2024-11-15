import { QueryRunner } from 'typeorm';

import { insertOrUpsertTable } from '../commons/functions';

export const inspectionItemTemplateTranslationTemplateURData = async (
  queryRunner: QueryRunner,
) => {
  const data: {
    inspection_item_id: string;
    iso_locale_code: string;
    item_name: string;
    item_description: string;
  }[] = [
    //ur
    //1
    {
      inspection_item_id: '01HK4QBQJDXRCZ1BD4T44MMGXJ',
      iso_locale_code: 'ur',
      item_name: 'کام کے سامان کے ارد گرد بصری چیک',
      item_description:
        'کام کے سازوسامان، سلنڈر، ربط، اور ہوزز کو نقصان، پہننے، کھیلنے کے لیے چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4QBQJD17KT5ZEYA0N3HVYS',
      iso_locale_code: 'ur',
      item_name: 'مشین کے ارد گرد بصری چیک',
      item_description:
        'حصوں کے نقصان، اخترتی، دراڑیں، ڈھیلے اور کھوئے ہوئے کو چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4QBQJD0406HG49VHQ8NFKV',
      iso_locale_code: 'ur',
      item_name: 'انجن/ہائیڈرولک سسٹم سے رساو',
      item_description:
        'کولنٹ اور تیل کے رساو کے لیے انجن، ہائیڈرولک اجزاء اور کولنٹ سسٹم کے ارد گرد چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4QBQJDNNTZWJ0XB2542Y36',
      iso_locale_code: 'ur',
      item_name: 'انجن/ہائیڈرولک سسٹم کا تیل اور کولنٹ لیول',
      item_description:
        'انجن، ہائیڈرولک اجزاء اور کولنٹ سسٹم کے تیل کی سطح کو چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4QBQJEFT788311KJS1HWH9',
      iso_locale_code: 'ur',
      item_name: 'بیٹری',
      item_description:
        'بیٹری کے پا نی کی سطح، خرابی، گندگی، بندش اور وائرنگ ہارنس کا ڈھیلا پن چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4QBQJEQV14AKHR3K9VPQKP',
      iso_locale_code: 'ur',
      item_name: 'حفاظتی سامان کے لیے کام کرنا',
      item_description:
        ' تصدیق کریں کہ ہیڈ لائٹس، ٹرن سگنلز اور دیگر بصری اور سننے والے الارم ٹھیک سے کام کر رہے ہیں۔',
    },
    {
      inspection_item_id: '01HK4QBQJEAAV2Y3FZCK2MXDBX',
      iso_locale_code: 'ur',
      item_name: 'حفاظتی سامان کے لیے نقصان',
      item_description:
        'شگاف، ٹوٹے ہوئے، شیشے کے غائب، شیشے، خراب شدہ قدم، ہاتھ کی ریل تلاش کریں۔ (جہاں قابل اطلاق ہو)',
    },
    {
      inspection_item_id: '01HK4QBQJEHJA5D4NM03SRWR0B',
      iso_locale_code: 'ur',
      item_name: 'انڈر کیرج، بریک، ٹائر',
      item_description: 'فلیٹ یا خراب ٹائر، بریک کی کارکردگی چیک کریں',
    },
    {
      inspection_item_id: '01HK4QBQJEHAGVSPE9M8MV887J',
      iso_locale_code: 'ur',
      item_name: 'برقی جزو',
      item_description:
        'کیبن کا الیکٹرانکس ڈسپلے پر فعال الارم یا احتیاطی چراغ کی اطلاعات دیکھیں۔',
    },
    {
      inspection_item_id: '01HK4QFQ1AEVDQYFPYE8HDTX40',
      iso_locale_code: 'ur',
      item_name: 'سروس میٹر (گھنٹہ)',
      item_description: '',
    },
    {
      inspection_item_id: '01HK4R8HHE4E5R0SKKTJ03RGPR',
      iso_locale_code: 'ur',
      item_name: 'اوڈومیٹر (کلومیٹر)',
      item_description: '',
    },
    //2
    {
      inspection_item_id: '01HK4R9TN6ATSX3EKPX8SAP3CC',
      iso_locale_code: 'ur',
      item_name: 'کام کے سامان کے ارد گرد بصری چیک',
      item_description:
        'کام کے سازوسامان، سلنڈر، لنکج، اور ہوزز کو نقصان، پہننے، لچک چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4R9TN723N5286RHTR1GZ74',
      iso_locale_code: 'ur',
      item_name: 'مشین کے ارد گرد بصری چیک',
      item_description:
        'حصوں کے نقصان، اخترتی، دراڑیں، ڈھیلے اور کھوئے ہوئے کو چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4R9TN75GE24YR06M28H8WE',
      iso_locale_code: 'ur',
      item_name: 'ایندھن کا ٹینک، پانی الگ کرنے والا',
      item_description:
        'ایندھن کے ٹینک، پانی کو الگ کرنے والے اور پانی اور  نکالیں۔',
    },
    {
      inspection_item_id: '01HK4R9TN78PB15KYDM3ADKRBD',
      iso_locale_code: 'ur',
      item_name: 'کولنٹ کی سطح',
      item_description: 'کولنٹ لیول چیک کریں، کولنٹ شامل کریں۔',
    },
    {
      inspection_item_id: '01HK4R9TN7FXK32NVYVQ3MPY90',
      iso_locale_code: 'ur',
      item_name: 'انجن کے تیل کی سطح',
      item_description: 'انجن آئل پین میں تیل کی سطح چیک کریں، تیل ڈالیں۔',
    },
    {
      inspection_item_id: '01HK4R9TN7EKDQ76Q4XYN87EWH',
      iso_locale_code: 'ur',
      item_name: 'ایندھن کی سطح',
      item_description: 'ایندھن کی سطح چیک کریں، ایندھن شامل کریں۔',
    },
    {
      inspection_item_id: '01HK4R9TN7VSK08626X3ERGZAG',
      iso_locale_code: 'ur',
      item_name: 'ہائیڈرولک تیل کی سطح',
      item_description:
        'ہائیڈرولک ٹینک میں تیل کی سطح کو چیک کریں، تیل شامل کریں',
    },
    {
      inspection_item_id: '01HK4R9TN7RRXCFXHF0YPAMXD1',
      iso_locale_code: 'ur',
      item_name: 'دھول کا اشارہ',
      item_description: 'دھول کے اشارے کو چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4R9TN8CB8BP9A3K8A3B82Y',
      iso_locale_code: 'ur',
      item_name: 'الیکٹرک وائرنگ',
      item_description: 'بجلی کی وائرنگ چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4R9TN8G1NSF03X4VG3ETMP',
      iso_locale_code: 'ur',
      item_name: 'چراغ جلتے ہیں۔',
      item_description: 'چیک کریں کہ لیمپ روشن ہیں۔',
    },
    {
      inspection_item_id: '01HK4R9TN8BCJYTWZ03ZG9C2WN',
      iso_locale_code: 'ur',
      item_name: 'ہارن',
      item_description: 'ہارن چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4RFYKQ033YWMWFP1WFV0NH',
      iso_locale_code: 'ur',
      item_name: 'سروس میٹر (گھنٹہ)',
      item_description: '',
    },
    {
      inspection_item_id: '01HK4RH324E04ENEDWY3A5DXEH',
      iso_locale_code: 'ur',
      item_name: 'اوڈومیٹر (کلومیٹر)',
      item_description: '',
    },
    //3
    {
      inspection_item_id: '01HK4RP8TECEV3EZF7THV1NJRG',
      iso_locale_code: 'ur',
      item_name: 'کام کے سامان کے ارد گرد بصری چیک',
      item_description:
        'کام کے سازوسامان، سلنڈر، ربط، اور ہوزز کو نقصان، پہننے، کھیلنے کے لیے چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4RP8TFG47A071JVE4DKDRE',
      iso_locale_code: 'ur',
      item_name: 'مشین کے ارد گرد بصری چیک',
      item_description:
        'حصوں کے نقصان، اخترتی، دراڑیں، ڈھیلے اور کھوئے ہوئے کو چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4RP8TFKKBTNG06616SDYZC',
      iso_locale_code: 'ur',
      item_name: 'ایندھن کا ٹینک، پانی الگ کرنے والا',
      item_description:
        'ایندھن کے ٹینک، پانی کو الگ کرنے والے اور پانی اور تلچھٹ کو نکالیں۔',
    },
    {
      inspection_item_id: '01HK4RP8TFGY8VJFTJQEC84MF2',
      iso_locale_code: 'ur',
      item_name: 'کولنٹ کی سطح',
      item_description: 'کولنٹ لیول چیک کریں، کولنٹ شامل کریں۔',
    },
    {
      inspection_item_id: '01HK4RP8TFPVBKEA5Q1YFWQW6G',
      iso_locale_code: 'ur',
      item_name: 'انجن کے تیل کی سطح',
      item_description: 'انجن آئل پین میں تیل کی سطح چیک کریں، تیل ڈالیں۔',
    },
    {
      inspection_item_id: '01HK4RP8TFTKAD1HV9J5GQ85ZR',
      iso_locale_code: 'ur',
      item_name: 'ایندھن کی سطح',
      item_description: 'ایندھن کی سطح چیک کریں، ایندھن شامل کریں۔',
    },
    {
      inspection_item_id: '01HK4RP8TFA2CTFBQT91PW1GH3',
      iso_locale_code: 'ur',
      item_name: 'ہائیڈرولک تیل کی سطح',
      item_description:
        'ہائیڈرولک ٹینک میں تیل کی سطح کو چیک کریں، تیل شامل کریں',
    },
    {
      inspection_item_id: '01HK4RP8TFYEH1SEXA1XN4YT6J',
      iso_locale_code: 'ur',
      item_name: 'ٹرانسمیشن / پاور ٹرین تیل کی سطح',
      item_description:
        'ٹرانسمیشن/پاور ٹرین کیس میں تیل کی سطح چیک کریں، تیل شامل کریں۔',
    },
    {
      inspection_item_id: '01HK4RP8TGCCH7WTKFKWRT15C9',
      iso_locale_code: 'ur',
      item_name: 'ٹائر',
      item_description:
        ' ٹائروں کے نقصان، افراط زر کا دباؤ، وہیل بولٹ، نٹ چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4RP8TGZTFF9JXPVVJHPRKV',
      iso_locale_code: 'ur',
      item_name: 'الیکٹرک وائرنگ',
      item_description: 'بجلی کی وائرنگ چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4RP8TGET49KR74MX9DZW3D',
      iso_locale_code: 'ur',
      item_name: 'چراغ جلتے ہیں۔',
      item_description: 'چیک کریں کہ لیمپ روشن ہیں۔',
    },
    {
      inspection_item_id: '01HK4RP8TGDD68VECWBE23AC6V',
      iso_locale_code: 'ur',
      item_name: 'ہارن',
      item_description: 'ہارن چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4RP8TG0J803JXSC97RYM2S',
      iso_locale_code: 'ur',
      item_name: 'مشین مانیٹر',
      item_description: 'مشین مانیٹر چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4RWHA1KB1MR1KNRX3MDK9W',
      iso_locale_code: 'ur',
      item_name: 'سروس میٹر (گھنٹہ)',
      item_description: '',
    },
    {
      inspection_item_id: '01HK4RWYRZ292RP7GCABJ77Y14',
      iso_locale_code: 'ur',
      item_name: 'اوڈومیٹر (کلومیٹر)',
      item_description: '',
    },
    //4
    {
      inspection_item_id: '01HK4SF4D94DRZ9THKJWNE8AM5',
      iso_locale_code: 'ur',
      item_name: 'کام کے سامان کے ارد گرد بصری چیک',
      item_description:
        'کام کے سازوسامان، سلنڈر، ربط، اور ہوزز کو نقصان، پہننے، کھیلنے کے لیے چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4SF4D9JMNJKKGTSRZFT6PV',
      iso_locale_code: 'ur',
      item_name: 'مشین کے ارد گرد بصری چیک',
      item_description:
        'حصوں کے نقصان، اخترتی، دراڑیں، ڈھیلے اور کھوئے ہوئے کو چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4SF4DA4WVN5AN24XSG1M3A',
      iso_locale_code: 'ur',
      item_name: 'ایندھن کا ٹینک، پانی الگ کرنے والا',
      item_description:
        'ایندھن کے ٹینک، پانی کو الگ کرنے والے اور پانی اور تلچھٹ کو نکالیں۔',
    },
    {
      inspection_item_id: '01HK4SF4DAHYXF5B2KHKGE7VGV',
      iso_locale_code: 'ur',
      item_name: 'انجن کے تیل کی سطح',
      item_description: 'انجن آئل پین میں تیل کی سطح چیک کریں، تیل ڈالیں۔',
    },
    {
      inspection_item_id: '01HK4SF4DAFTC3DDGASF60QZ4B',
      iso_locale_code: 'ur',
      item_name: 'کولنٹ کی سطح',
      item_description: 'کولنٹ لیول چیک کریں، کولنٹ شامل کریں۔',
    },
    {
      inspection_item_id: '01HK4SF4DAX7YJBX0V5ZAJ7TMQ',
      iso_locale_code: 'ur',
      item_name: 'ایندھن کی سطح',
      item_description: 'ایندھن کی سطح چیک کریں، ایندھن شامل کریں۔',
    },
    {
      inspection_item_id: '01HK4SF4DAP9MSKN9R5CESEFBK',
      iso_locale_code: 'ur',
      item_name: 'ہائیڈرولک تیل کی سطح',
      item_description:
        'ہائیڈرولک ٹینک میں تیل کی سطح کو چیک کریں، تیل شامل کریں',
    },
    {
      inspection_item_id: '01HK4SF4DAAYHZYJZA2H1HRP4M',
      iso_locale_code: 'ur',
      item_name: 'پاور ٹرین تیل کی سطح',
      item_description: 'پاور ٹرین کیس میں تیل کی سطح چیک کریں، تیل شامل کریں',
    },
    {
      inspection_item_id: '01HK4SF4DASTV3GKP0V40BAZS3',
      iso_locale_code: 'ur',
      item_name: 'دھول کا اشارہ',
      item_description: 'دھول کے اشارے کو چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4SF4DAXXCFVXHRR4YB51AW',
      iso_locale_code: 'ur',
      item_name: 'الیکٹرک وائرنگ',
      item_description: 'بجلی کی وائرنگ چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4SF4DA8D1HPM7KBCQWDAAD',
      iso_locale_code: 'ur',
      item_name: 'چراغ جلتے ہیں۔',
      item_description: 'چیک کریں کہ لیمپ روشن ہیں۔',
    },
    {
      inspection_item_id: '01HK4SF4DBVQ75HKDW8262HWQM',
      iso_locale_code: 'ur',
      item_name: 'ہارن',
      item_description: 'ہارن چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4SF4DBT268PWRX8HX5ZV42',
      iso_locale_code: 'ur',
      item_name: 'مشین مانیٹر',
      item_description: 'مشین مانیٹر چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4SF4DBRPCRSBMJF4N71S50',
      iso_locale_code: 'ur',
      item_name: 'بیک اپ الارم',
      item_description: 'بیک اپ الارم آپریشن چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4SMSYXR4TJDN8CAFD281N6',
      iso_locale_code: 'ur',
      item_name: 'سروس میٹر (گھنٹہ)',
      item_description: '',
    },
    {
      inspection_item_id: '01HK4SNVEVCHDR3VZ2B6WCV0E9',
      iso_locale_code: 'ur',
      item_name: 'اوڈومیٹر (کلومیٹر)',
      item_description: '',
    },
    //5
    {
      inspection_item_id: '01HK4SS2SQS7D6JZKBKTYM605T',
      iso_locale_code: 'ur',
      item_name: 'کام کے سامان کے ارد گرد بصری چیک',
      item_description:
        'کام کے سازوسامان، سلنڈر، ربط، اور ہوزز کو نقصان، پہننے، کھیلنے کے لیے چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4SS2SQF9NAQ1H25RQXFT91',
      iso_locale_code: 'ur',
      item_name: 'مشین کے ارد گرد بصری چیک',
      item_description:
        'حصوں کے نقصان، اخترتی، دراڑیں، ڈھیلے اور کھوئے ہوئے کو چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4SS2SQB1S2S7FP9EJQCNF2',
      iso_locale_code: 'ur',
      item_name: 'ایندھن کا ٹینک، پانی الگ کرنے والا',
      item_description:
        'ایندھن کے ٹینک، پانی کو الگ کرنے والے اور پانی اور تلچھٹ کو نکالیں۔',
    },
    {
      inspection_item_id: '01HK4SS2SQ7Z47HEKKXWKH26TD',
      iso_locale_code: 'ur',
      item_name: 'انجن کے تیل کی سطح',
      item_description: 'انجن آئل پین میں تیل کی سطح چیک کریں، تیل ڈالیں۔',
    },
    {
      inspection_item_id: '01HK4SS2SQVA3QVS2Q85RBKNP3',
      iso_locale_code: 'ur',
      item_name: 'کولنٹ کی سطح',
      item_description: 'کولنٹ لیول چیک کریں، کولنٹ شامل کریں۔',
    },
    {
      inspection_item_id: '01HK4SS2SRQKSRHEX6CTS4AZV3',
      iso_locale_code: 'ur',
      item_name: 'ایندھن کی سطح',
      item_description: 'ایندھن کی سطح چیک کریں، ایندھن شامل کریں۔',
    },
    {
      inspection_item_id: '01HK4SS2SREDQ3KS4ZPC9ERB8P',
      iso_locale_code: 'ur',
      item_name: 'ہائیڈرولک تیل کی سطح',
      item_description:
        'ہائیڈرولک ٹینک میں تیل کی سطح کو چیک کریں، تیل شامل کریں',
    },
    {
      inspection_item_id: '01HK4SS2SRMH9F72VRWGNPNF5Y',
      iso_locale_code: 'ur',
      item_name: 'ٹرانسمیشن / پاور ٹرین تیل کی سطح',
      item_description:
        'ٹرانسمیشن/پاور ٹرین کیس میں تیل کی سطح چیک کریں، تیل شامل کریں۔',
    },
    {
      inspection_item_id: '01HK4SS2SRC182QHTFMSQAA8M0',
      iso_locale_code: 'ur',
      item_name: 'دھول کا اشارہ',
      item_description: 'دھول کے اشارے کو چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4SS2SRKX30R7VKBG8K7TS3',
      iso_locale_code: 'ur',
      item_name: 'ٹائر',
      item_description:
        ' ٹائروں کے نقصان، افراط زر کا دباؤ، وہیل بولٹ، نٹ چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4SS2SRV92KVAKK9C7HHF9N',
      iso_locale_code: 'ur',
      item_name: 'سٹیئرنگ وہیل',
      item_description: 'اسٹیئرنگ وہیل کو چیک کریں اور ایڈجسٹ کریں۔',
    },
    {
      inspection_item_id: '01HK4SS2SR18C29ZQEBDZBSWRK',
      iso_locale_code: 'ur',
      item_name: 'واضح لاک پن',
      item_description: 'واضح لاک پن کو چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4SS2SR913KTB7CFT40BQEH',
      iso_locale_code: 'ur',
      item_name: 'جھکاؤ روکنے والا',
      item_description: 'جھکاؤ روکنے والے کو چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4SS2SRD5PRHXFM948FB1MF',
      iso_locale_code: 'ur',
      item_name: 'الیکٹرک وائرنگ',
      item_description: 'بجلی کی وائرنگ چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4SS2SRPQE85GJW6J3WBNKQ',
      iso_locale_code: 'ur',
      item_name: 'ہارن',
      item_description: 'ہارن چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4SZ1JD878Z6VBPCS5XDEQ1',
      iso_locale_code: 'ur',
      item_name: 'سروس میٹر (گھنٹہ)',
      item_description: '',
    },
    {
      inspection_item_id: '01HK4SZY91MM2RV9J2D5C2YXRM',
      iso_locale_code: 'ur',
      item_name: 'اوڈومیٹر (کلومیٹر)',
      item_description: '',
    },
    //6
    {
      inspection_item_id: '01HK4T101QSG2T3ED0XG3Q5E8F',
      iso_locale_code: 'ur',
      item_name: 'کام کے سامان کے ارد گرد بصری چیک',
      item_description:
        'کام کے سازوسامان، سلنڈر، ربط، اور ہوزز کو نقصان، پہننے، کھیلنے کے لیے چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4T101Q1K774P93CQX4QCJW',
      iso_locale_code: 'ur',
      item_name: 'مشین کے ارد گرد بصری چیک',
      item_description:
        'حصوں کے نقصان، اخترتی، دراڑیں، ڈھیلے اور کھوئے ہوئے کو چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4T101QFR9D7D56C4MAPVKF',
      iso_locale_code: 'ur',
      item_name: 'ایندھن کا ٹینک، پانی الگ کرنے والا',
      item_description:
        'ایندھن کے ٹینک، پانی کو الگ کرنے والے اور پانی اور تلچھٹ کو نکالیں۔',
    },
    {
      inspection_item_id: '01HK4T101QV2PEM91GN9BF07JS',
      iso_locale_code: 'ur',
      item_name: 'انجن کے تیل کی سطح',
      item_description: 'انجن آئل پین میں تیل کی سطح چیک کریں، تیل ڈالیں۔',
    },
    {
      inspection_item_id: '01HK4T101QDC4Y7742MSWA42KH',
      iso_locale_code: 'ur',
      item_name: 'کولنٹ کی سطح',
      item_description: 'کولنٹ لیول چیک کریں، کولنٹ شامل کریں۔',
    },
    {
      inspection_item_id: '01HK4T101RWP6GMA8FG1NBJG8H',
      iso_locale_code: 'ur',
      item_name: 'ایندھن کی سطح',
      item_description: 'ایندھن کی سطح چیک کریں، ایندھن شامل کریں۔',
    },
    {
      inspection_item_id: '01HK4T101R65T6BJMMZTMC0T7P',
      iso_locale_code: 'ur',
      item_name: 'ٹرانسمیشن تیل کی سطح',
      item_description: 'ٹرانسمیشن کیس میں تیل کی سطح چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4T101RT8NDVFVAYHJ3C6YS',
      iso_locale_code: 'ur',
      item_name: 'ہائیڈرولک تیل کی سطح',
      item_description:
        'ہائیڈرولک ٹینک میں تیل کی سطح کو چیک کریں، تیل شامل کریں',
    },
    {
      inspection_item_id: '01HK4T101RQ767DZ39QP00MWTZ',
      iso_locale_code: 'ur',
      item_name: 'دھول کا اشارہ',
      item_description: 'دھول کے اشارے کو چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4T101RTWC90K2A50H4Q8GP',
      iso_locale_code: 'ur',
      item_name: 'ٹائر',
      item_description:
        ' ٹائروں کے نقصان، افراط زر کا دباؤ، وہیل بولٹ، نٹ چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4T101RHBRK1V94B6RRHGW3',
      iso_locale_code: 'ur',
      item_name: 'الیکٹرک وائرنگ',
      item_description: 'بجلی کی وائرنگ چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4T101R27XQ3J6M7MMB103T',
      iso_locale_code: 'ur',
      item_name: 'مشین مانیٹر',
      item_description: 'مشین مانیٹر چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4T101RWGTK92JGKJNNZQ58',
      iso_locale_code: 'ur',
      item_name: 'بیک اپ الارم',
      item_description: 'بیک اپ الارم آپریشن چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4T101RTWD5T2PB7CX2D320',
      iso_locale_code: 'ur',
      item_name: 'ثانوی اسٹیئرنگ',
      item_description: 'ثانوی اسٹیئرنگ چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4T101RKDPTGJ352NN16YPM',
      iso_locale_code: 'ur',
      item_name: 'بریک آپریشن',
      item_description: 'بریک آپریشن چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4T70XCDRMZNCPV41HKZFWE',
      iso_locale_code: 'ur',
      item_name: 'سروس میٹر (گھنٹہ)',
      item_description: '',
    },
    {
      inspection_item_id: '01HK4T7M097W0J2B63D2A51167',
      iso_locale_code: 'ur',
      item_name: 'اوڈومیٹر (کلومیٹر)',
      item_description: '',
    },
    //7
    {
      inspection_item_id: '01HK4T8MDD8TRPF31W4B9Z8AST',
      iso_locale_code: 'ur',
      item_name: 'کام کے سامان کے ارد گرد بصری چیک',
      item_description:
        'کام کے سازوسامان، سلنڈر، ربط، اور ہوزز کو نقصان، پہننے، کھیلنے کے لیے چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4T8MDDX1JAWPF7RSS5A3A5',
      iso_locale_code: 'ur',
      item_name: 'مشین کے ارد گرد بصری چیک',
      item_description:
        'حصوں کے نقصان، اخترتی، دراڑیں، ڈھیلے اور کھوئے ہوئے کو چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4T8MDENHWM7YDE59NGNF85',
      iso_locale_code: 'ur',
      item_name: 'ایندھن کا ٹینک، پانی الگ کرنے والا',
      item_description:
        'ایندھن کے ٹینک، پانی کو الگ کرنے والے اور پانی اور تلچھٹ کو نکالیں۔',
    },
    {
      inspection_item_id: '01HK4T8MDEAWPEAZR1EHF4GMB5',
      iso_locale_code: 'ur',
      item_name: 'انجن کے تیل کی سطح',
      item_description: 'انجن آئل پین میں تیل کی سطح چیک کریں، تیل ڈالیں۔',
    },
    {
      inspection_item_id: '01HK4T8MDE8MTEBTNJRMYAQTT7',
      iso_locale_code: 'ur',
      item_name: 'کولنٹ کی سطح',
      item_description: 'کولنٹ لیول چیک کریں، کولنٹ شامل کریں۔',
    },
    {
      inspection_item_id: '01HK4T8MDFWR70N66Q5AJGDTFK',
      iso_locale_code: 'ur',
      item_name: 'ایندھن کی سطح',
      item_description: 'ایندھن کی سطح چیک کریں، ایندھن شامل کریں۔',
    },
    {
      inspection_item_id: '01HK4T8MDF7WEAVWHR8Q432P15',
      iso_locale_code: 'ur',
      item_name: 'ہائیڈرولک تیل کی سطح',
      item_description:
        'ہائیڈرولک ٹینک میں تیل کی سطح کو چیک کریں، تیل شامل کریں',
    },
    {
      inspection_item_id: '01HK4T8MDFQRRPZQXYEDTQ968V',
      iso_locale_code: 'ur',
      item_name: 'ٹرانسمیشن تیل کی سطح',
      item_description: 'ٹرانسمیشن کیس میں تیل کی سطح چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4T8MDFYPF6M7KVKV36B7ZQ',
      iso_locale_code: 'ur',
      item_name: 'ٹائر',
      item_description:
        ' ٹائروں کے نقصان، افراط زر کا دباؤ، وہیل بولٹ، نٹ چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4T8MDF5T3E60D2XN3WB2S4',
      iso_locale_code: 'ur',
      item_name: 'الیکٹرک وائرنگ',
      item_description: 'بجلی کی وائرنگ چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4T8MDG0R29M49MNZGHW73W',
      iso_locale_code: 'ur',
      item_name: 'مشین مانیٹر',
      item_description: 'مشین مانیٹر چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4T8MDGN9Z8SC1M39GFP9VA',
      iso_locale_code: 'ur',
      item_name: 'چراغ جلتے ہیں۔',
      item_description: 'چیک کریں کہ لیمپ روشن ہیں۔',
    },
    {
      inspection_item_id: '01HK4T8MDG8D0F0K04XH3GE9JJ',
      iso_locale_code: 'ur',
      item_name: 'ہارن',
      item_description: 'ہارن چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4T8MDG2S56F07BAH3GX2DP',
      iso_locale_code: 'ur',
      item_name: 'بریک آپریشن',
      item_description: 'بریک آپریشن چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4TEQQ8FPGRKE6BZM365WM9',
      iso_locale_code: 'ur',
      item_name: 'سروس میٹر (گھنٹہ)',
      item_description: '',
    },
    {
      inspection_item_id: '01HK4TFCXMHC2F6FNPC4N4M90V',
      iso_locale_code: 'ur',
      item_name: 'اوڈومیٹر (کلومیٹر)',
      item_description: '',
    },
    //8
    {
      inspection_item_id: '01HK4TH7TK4326QFZCF1JW65TF',
      iso_locale_code: 'ur',
      item_name: 'کام کے سامان کے ارد گرد بصری چیک',
      item_description:
        'کام کے سازوسامان، سلنڈر، ربط، اور ہوزز کو نقصان، پہننے، کھیلنے کے لیے چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4TH7TMEBA4JBDPW3QE9ZQS',
      iso_locale_code: 'ur',
      item_name: 'مشین کے ارد گرد بصری چیک',
      item_description:
        'حصوں کے نقصان، اخترتی، دراڑیں، ڈھیلے اور کھوئے ہوئے کو چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4TH7TM3VKWBNWP4V3H8Q6Z',
      iso_locale_code: 'ur',
      item_name: 'انجن کے تیل کی سطح',
      item_description: 'انجن آئل پین میں تیل کی سطح چیک کریں، تیل ڈالیں۔',
    },
    {
      inspection_item_id: '01HK4TH7TMZKGCV3CEHZ7JZ8QE',
      iso_locale_code: 'ur',
      item_name: 'کولنٹ کی سطح',
      item_description: 'کولنٹ لیول چیک کریں، کولنٹ شامل کریں۔',
    },
    {
      inspection_item_id: '01HK4TH7TNWMJ1MMZ12DFCXDV4',
      iso_locale_code: 'ur',
      item_name: 'ایندھن کی سطح',
      item_description: 'ایندھن کی سطح چیک کریں، ایندھن شامل کریں۔',
    },
    {
      inspection_item_id: '01HK4TH7TNFCFCNM5QWZKVYVFW',
      iso_locale_code: 'ur',
      item_name: 'ہائیڈرولک تیل کی سطح',
      item_description:
        'ہائیڈرولک ٹینک میں تیل کی سطح کو چیک کریں، تیل شامل کریں',
    },
    {
      inspection_item_id: '01HK4TH7TNAGRH4W0Q5431BQZ1',
      iso_locale_code: 'ur',
      item_name: 'ٹائر',
      item_description:
        ' ٹائروں کے نقصان، افراط زر کا دباؤ، وہیل بولٹ، نٹ چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4TH7TN8N6XWG89TSJK14VD',
      iso_locale_code: 'ur',
      item_name: 'الیکٹرک وائرنگ',
      item_description: 'بجلی کی وائرنگ چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4TH7TP63H93066X40HDAR6',
      iso_locale_code: 'ur',
      item_name: 'چراغ جلتے ہیں۔',
      item_description: 'چیک کریں کہ لیمپ روشن ہیں۔',
    },
    {
      inspection_item_id: '01HK4TH7TP6GJ1691PYX8NHR0Q',
      iso_locale_code: 'ur',
      item_name: 'ہارن',
      item_description: 'ہارن چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4TNKZS4FE9YWASZ69HZZN2',
      iso_locale_code: 'ur',
      item_name: 'سروس میٹر (گھنٹہ)',
      item_description: '',
    },
    {
      inspection_item_id: '01HK4TPA3936DBN3CVFF4RX7Z9',
      iso_locale_code: 'ur',
      item_name: 'اوڈومیٹر (کلومیٹر)',
      item_description: '',
    },
    //9
    {
      inspection_item_id: '01HK4TQMTXQFQVK5362AF7ZGFY',
      iso_locale_code: 'ur',
      item_name: 'مشین کے ارد گرد بصری چیک',
      item_description: 'دراڑیں، نقصانات اور چڑھنے کی حالت کو چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4TQMTYCSM84FJ5D489BV0T',
      iso_locale_code: 'ur',
      item_name: 'کام کے سامان کے ارد گرد بصری چیک',
      item_description:
        'ڈھیلے جھکاؤ والے سلنڈر راڈ لاک گری دار میوے کو چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4TQMTYCSH5PVKRMMYBAKQD',
      iso_locale_code: 'ur',
      item_name: 'تیل اور بیٹری الیکٹرولائٹ',
      item_description: 'تیل اور بیٹری الیکٹرولائٹ کے رساو کو چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4TQMTYRJACJJ25BS70BBPN',
      iso_locale_code: 'ur',
      item_name: 'بیٹری الیکٹرولائٹ کی سطح',
      item_description: 'بیٹری الیکٹرولائٹ لیول چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4TQMTYY6CF3FD2GQCG6PND',
      iso_locale_code: 'ur',
      item_name: 'ہائیڈرولک تیل کی سطح',
      item_description:
        'ہائیڈرولک ٹینک میں تیل کی سطح کو چیک کریں، تیل شامل کریں',
    },
    {
      inspection_item_id: '01HK4TQMTY0TVVGRKN61EM0ANM',
      iso_locale_code: 'ur',
      item_name: 'بریک آئل لیول',
      item_description: 'بریک آئل لیول چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4TQMTYPX09SX14M2J8ZYHG',
      iso_locale_code: 'ur',
      item_name: 'ٹائر',
      item_description:
        ' ٹائروں کے نقصان، افراط زر کا دباؤ، وہیل بولٹ، نٹ چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4TQMTZS480KP36NC0YH1AV',
      iso_locale_code: 'ur',
      item_name: 'مشین مانیٹر',
      item_description: 'مشین مانیٹر چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4TQMTZEG4F653FVY0629HT',
      iso_locale_code: 'ur',
      item_name: 'پارکنگ بریک',
      item_description: 'پارکنگ بریک چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4TQMTZCKHHTG2Y490D1KG1',
      iso_locale_code: 'ur',
      item_name: 'بریکوں کے پیڈل',
      item_description: 'بریک پیڈل چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4TQMTZ2JE3DFVACE4DMGWV',
      iso_locale_code: 'ur',
      item_name: 'بریک آپریشن',
      item_description: 'بریک آپریشن چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4TQMTZMJF3HMB5GY1GJSEK',
      iso_locale_code: 'ur',
      item_name: 'چراغ جلتے ہیں۔',
      item_description: 'چیک کریں کہ لیمپ روشن ہیں۔',
    },
    {
      inspection_item_id: '01HK4TQMTZNDZGFTSP1ADFEB1M',
      iso_locale_code: 'ur',
      item_name: 'لیمپ، لینس کا نقصان',
      item_description:
        'لیمپ، لینس وغیرہ کی آلودگی اور/یا نقصانات کی جانچ کریں۔',
    },
    {
      inspection_item_id: '01HK4TQMTZP9VGJTJMZBWY5775',
      iso_locale_code: 'ur',
      item_name: 'ہارن',
      item_description: 'ہارن چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4TQMTZZ99T46G0MPNTXNX4',
      iso_locale_code: 'ur',
      item_name: 'آئینہ',
      item_description: 'سائیڈ ویو مررز اور انڈر ویو مررز کو چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4TQMV0BZ3JCMWNRNRRX1N5',
      iso_locale_code: 'ur',
      item_name: 'سیٹ بیلٹ',
      item_description: 'سیٹ بیلٹ کے نقصانات اور کارکردگی کو چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4VHYQ31E2SDKESDC58FN3S',
      iso_locale_code: 'ur',
      item_name: 'سروس میٹر (گھنٹہ)',
      item_description: '',
    },
    {
      inspection_item_id: '01HK4VK1QPYFWWQV3MYZZ0TFFB',
      iso_locale_code: 'ur',
      item_name: 'اوڈومیٹر (کلومیٹر)',
      item_description: '',
    },
    //10
    {
      inspection_item_id: '01HK4VN3TBXE4P9B51PBC59AM8',
      iso_locale_code: 'ur',
      item_name: 'مشین کے ارد گرد بصری چیک',
      item_description: 'دراڑیں، نقصانات اور چڑھنے کی حالت کو چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4VN3TCJ1JYSK3PSMG4T20S',
      iso_locale_code: 'ur',
      item_name: 'کام کے سامان کے ارد گرد بصری چیک',
      item_description:
        'ڈھیلے جھکاؤ والے سلنڈر راڈ لاک گری دار میوے کو چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4VN3TCNEVHP5JCVKWRKC7J',
      iso_locale_code: 'ur',
      item_name: 'انجن کے تیل کی سطح',
      item_description: 'انجن آئل پین میں تیل کی سطح چیک کریں، تیل ڈالیں۔',
    },
    {
      inspection_item_id: '01HK4VN3TCSYK8F1B6CWMDWS9E',
      iso_locale_code: 'ur',
      item_name: 'کولنٹ کی سطح',
      item_description: 'کولنٹ لیول چیک کریں، کولنٹ شامل کریں۔',
    },
    {
      inspection_item_id: '01HK4VN3TCEX5Q7GJNDWVG4KKC',
      iso_locale_code: 'ur',
      item_name: 'ایندھن کی سطح',
      item_description: 'ایندھن کی سطح چیک کریں، ایندھن شامل کریں۔',
    },
    {
      inspection_item_id: '01HK4VN3TC8CCPRM2A8Y6T4CCW',
      iso_locale_code: 'ur',
      item_name: 'ہائیڈرولک تیل کی سطح',
      item_description:
        'ہائیڈرولک ٹینک میں تیل کی سطح کو چیک کریں، تیل شامل کریں',
    },
    {
      inspection_item_id: '01HK4VN3TCJZZWHVB5V6A379YZ',
      iso_locale_code: 'ur',
      item_name: 'بریک آئل لیول',
      item_description: 'بریک آئل لیول چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4VN3TCYD30244SDWN56N23',
      iso_locale_code: 'ur',
      item_name: 'ٹرانسمیشن تیل کی سطح',
      item_description: 'ٹرانسمیشن کیس میں تیل کی سطح چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4VN3TC3HF02C5FE0G49DWT',
      iso_locale_code: 'ur',
      item_name: 'ٹائر',
      item_description:
        ' ٹائروں کے نقصان، افراط زر کا دباؤ، وہیل بولٹ، نٹ چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4VN3TCSJNPT30F4FBX4HM7',
      iso_locale_code: 'ur',
      item_name: 'بیٹری الیکٹرولائٹ کی سطح',
      item_description: 'بیٹری الیکٹرولائٹ لیول چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4VN3TCHV82E9ZS85YNBA89',
      iso_locale_code: 'ur',
      item_name: 'مشین مانیٹر',
      item_description: 'مشین مانیٹر چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4VN3TCESMMAPC72RPX2Q9P',
      iso_locale_code: 'ur',
      item_name: 'پارکنگ بریک',
      item_description: 'پارکنگ بریک چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4VN3TDMQH7G205ET72JTCR',
      iso_locale_code: 'ur',
      item_name: 'چراغ جلتے ہیں۔',
      item_description: 'چیک کریں کہ لیمپ روشن ہیں۔',
    },
    {
      inspection_item_id: '01HK4VN3TD9AZHWK16YFVRGGXA',
      iso_locale_code: 'ur',
      item_name: 'لیمپ، لینس کا نقصان',
      item_description:
        'لیمپ، لینس وغیرہ کی آلودگی اور/یا نقصانات کی جانچ کریں۔',
    },
    {
      inspection_item_id: '01HK4VN3TD9PTZQ846D9MRZC81',
      iso_locale_code: 'ur',
      item_name: 'ہارن',
      item_description: 'ہارن چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4VN3TD99ZWFT7CVFM1C2YS',
      iso_locale_code: 'ur',
      item_name: 'بریکوں کے پیڈل',
      item_description: 'بریک پیڈل چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4VN3TD2XX6TWN867JCBPVQ',
      iso_locale_code: 'ur',
      item_name: 'بریک آپریشن',
      item_description: 'بریک آپریشن چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4VN3TD15RNKTMBMTYV7V9J',
      iso_locale_code: 'ur',
      item_name: 'آئینہ',
      item_description: 'سائیڈ ویو مررز اور انڈر ویو مررز کو چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4VN3TDF01ZM9GBXZDR4K1S',
      iso_locale_code: 'ur',
      item_name: 'سیٹ بیلٹ',
      item_description: 'سیٹ بیلٹ کے نقصانات اور کارکردگی کو چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4VV99TETE7B4EGX5ZC5QPS',
      iso_locale_code: 'ur',
      item_name: 'سروس میٹر (گھنٹہ)',
      item_description: '',
    },
    {
      inspection_item_id: '01HK4VVTSJX7ZEW3K53QSKXCZE',
      iso_locale_code: 'ur',
      item_name: 'اوڈومیٹر (کلومیٹر)',
      item_description: '',
    },
    //11
    {
      inspection_item_id: '01HK4VWZVEHGK19HY0GZP9EWWD',
      iso_locale_code: 'ur',
      item_name: 'کام کے سامان کے ارد گرد بصری چیک',
      item_description:
        'کام کے سازوسامان، سلنڈر، ربط، اور ہوزز کو نقصان، پہننے، کھیلنے کے لیے چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4VWZVECWJT1ETD8SD96HMR',
      iso_locale_code: 'ur',
      item_name: 'مشین کے ارد گرد بصری چیک',
      item_description:
        'حصوں کے نقصان، اخترتی، دراڑیں، ڈھیلے اور کھوئے ہوئے کو چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4VWZVE51QPHHF1599JXAR6',
      iso_locale_code: 'ur',
      item_name: 'ایندھن کا ٹینک، پانی الگ کرنے والا',
      item_description:
        'ایندھن کے ٹینک، پانی کو الگ کرنے والے اور پانی اور تلچھٹ کو نکالیں۔',
    },
    {
      inspection_item_id: '01HK4VWZVFNC15FM3E8TRMHGE3',
      iso_locale_code: 'ur',
      item_name: 'انجن کے تیل کی سطح',
      item_description: 'انجن آئل پین میں تیل کی سطح چیک کریں، تیل ڈالیں۔',
    },
    {
      inspection_item_id: '01HK4VWZVFK10E2NYRXAZ8Z7CZ',
      iso_locale_code: 'ur',
      item_name: 'کولنٹ کی سطح',
      item_description: 'کولنٹ لیول چیک کریں، کولنٹ شامل کریں۔',
    },
    {
      inspection_item_id: '01HK4VWZVF50Y2AA5DZATD1KZV',
      iso_locale_code: 'ur',
      item_name: 'ہائیڈرولک تیل کی سطح',
      item_description:
        'ہائیڈرولک ٹینک میں تیل کی سطح کو چیک کریں، تیل شامل کریں',
    },
    {
      inspection_item_id: '01HK4VWZVF6ZC6T2BARZYR3ES7',
      iso_locale_code: 'ur',
      item_name: 'ایندھن کی سطح',
      item_description: 'ایندھن کی سطح چیک کریں، ایندھن شامل کریں۔',
    },
    {
      inspection_item_id: '01HK4VWZVFGKHFQBFV4X6SS9XX',
      iso_locale_code: 'ur',
      item_name: 'ٹائر',
      item_description:
        ' ٹائروں کے نقصان، افراط زر کا دباؤ، وہیل بولٹ، نٹ چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4VWZVF74H3C20PWE9SHKM6',
      iso_locale_code: 'ur',
      item_name: 'الیکٹرک وائرنگ',
      item_description: 'بجلی کی وائرنگ چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4VWZVFRA5KJKC9ZMJSP22K',
      iso_locale_code: 'ur',
      item_name: 'چراغ جلتے ہیں۔',
      item_description: 'چیک کریں کہ لیمپ روشن ہیں۔',
    },
    {
      inspection_item_id: '01HK4VWZVGT0DXZFNMZPXNBBZ0',
      iso_locale_code: 'ur',
      item_name: 'ہارن',
      item_description: 'ہارن چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4W1TZDE8YH52NTS6P8SZ3R',
      iso_locale_code: 'ur',
      item_name: 'سروس میٹر (گھنٹہ)',
      item_description: '',
    },
    {
      inspection_item_id: '01HK4W2J6JFNH66YVKJQFN2DR7',
      iso_locale_code: 'ur',
      item_name: 'اوڈومیٹر (کلومیٹر)',
      item_description: '',
    },
    //12
    {
      inspection_item_id: '01HK4W4AW8BQ2TZ1ZW7CP661NK',
      iso_locale_code: 'ur',
      item_name: 'کام کے سامان کے ارد گرد بصری چیک',
      item_description:
        'کام کے سازوسامان، سلنڈر، ربط، اور ہوزز کو نقصان، پہننے، کھیلنے کے لیے چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4W4AW9KY6H30P5V1QR6Z76',
      iso_locale_code: 'ur',
      item_name: 'مشین کے ارد گرد بصری چیک',
      item_description:
        'حصوں کے نقصان، اخترتی، دراڑیں، ڈھیلے اور کھوئے ہوئے کو چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4W4AW9VEZGDAPGA63B005N',
      iso_locale_code: 'ur',
      item_name: 'ایندھن کا ٹینک، پانی الگ کرنے والا',
      item_description:
        'ایندھن کے ٹینک، پانی کو الگ کرنے والے اور پانی اور تلچھٹ کو نکالیں۔',
    },
    {
      inspection_item_id: '01HK4W4AW9CWFF6C9F5TFVG3BD',
      iso_locale_code: 'ur',
      item_name: 'انجن کے تیل کی سطح',
      item_description: 'انجن آئل پین میں تیل کی سطح چیک کریں، تیل ڈالیں۔',
    },
    {
      inspection_item_id: '01HK4W4AW988BFPVDRSXM350Z0',
      iso_locale_code: 'ur',
      item_name: 'کولنٹ کی سطح',
      item_description: 'کولنٹ لیول چیک کریں، کولنٹ شامل کریں۔',
    },
    {
      inspection_item_id: '01HK4W4AW9NHN4XKC6Y1W55ASF',
      iso_locale_code: 'ur',
      item_name: 'ایندھن کی سطح',
      item_description: 'ایندھن کی سطح چیک کریں، ایندھن شامل کریں۔',
    },
    {
      inspection_item_id: '01HK4W4AW9T0NX81M28WY11TXY',
      iso_locale_code: 'ur',
      item_name: 'ٹائر',
      item_description:
        ' ٹائروں کے نقصان، افراط زر کا دباؤ، وہیل بولٹ، نٹ چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4W4AW9RSX0KBXBBTQ181HF',
      iso_locale_code: 'ur',
      item_name: 'الیکٹرک وائرنگ',
      item_description: 'بجلی کی وائرنگ چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4W4AW9KK0NSQZ5F64P9C5D',
      iso_locale_code: 'ur',
      item_name: 'چراغ جلتے ہیں۔',
      item_description: 'چیک کریں کہ لیمپ روشن ہیں۔',
    },
    {
      inspection_item_id: '01HK4W4AW9AFX2ZCQRKNS6S60P',
      iso_locale_code: 'ur',
      item_name: 'ہارن',
      item_description: 'ہارن چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4W87H8YCQ69F8NJPD8WMDT',
      iso_locale_code: 'ur',
      item_name: 'سروس میٹر (گھنٹہ)',
      item_description: '',
    },
    {
      inspection_item_id: '01HK4W9JA2TZPBKKSZAHSJD7G9',
      iso_locale_code: 'ur',
      item_name: 'اوڈومیٹر (کلومیٹر)',
      item_description: '',
    },
    //13
    {
      inspection_item_id: '01HK4WACNZQTZP6NB36VE5X7PC',
      iso_locale_code: 'ur',
      item_name: 'کام کے سامان کے ارد گرد بصری چیک',
      item_description:
        'کام کے سازوسامان، سلنڈر، ربط، اور ہوزز کو نقصان، پہننے، کھیلنے کے لیے چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4WACNZ49ADD78HCD4KNVQ9',
      iso_locale_code: 'ur',
      item_name: 'مشین کے ارد گرد بصری چیک',
      item_description:
        'حصوں کے نقصان، اخترتی، دراڑیں، ڈھیلے اور کھوئے ہوئے کو چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4WACNZG48RXGTVHYYY1PBT',
      iso_locale_code: 'ur',
      item_name: 'ایندھن کا ٹینک، پانی الگ کرنے والا',
      item_description:
        'ایندھن کے ٹینک، پانی کو الگ کرنے والے اور پانی اور تلچھٹ کو نکالیں۔',
    },
    {
      inspection_item_id: '01HK4WACNZXKXQ1STSB3R8330E',
      iso_locale_code: 'ur',
      item_name: 'انجن کے تیل کی سطح',
      item_description: 'انجن آئل پین میں تیل کی سطح چیک کریں، تیل ڈالیں۔',
    },
    {
      inspection_item_id: '01HK4WACP0TKNW2E2ENJDWPJEG',
      iso_locale_code: 'ur',
      item_name: 'کولنٹ کی سطح',
      item_description: 'کولنٹ لیول چیک کریں، کولنٹ شامل کریں۔',
    },
    {
      inspection_item_id: '01HK4WACP085TP9NY5HKGCRKCC',
      iso_locale_code: 'ur',
      item_name: 'ایندھن کی سطح',
      item_description: 'ایندھن کی سطح چیک کریں، ایندھن شامل کریں۔',
    },
    {
      inspection_item_id: '01HK4WACP0BQPHCKKEV8AQANXD',
      iso_locale_code: 'ur',
      item_name: 'ہائیڈرولک تیل کی سطح',
      item_description:
        'ہائیڈرولک ٹینک میں تیل کی سطح کو چیک کریں، تیل شامل کریں',
    },
    {
      inspection_item_id: '01HK4WACP0NN66HK3QMFEQHQ7R',
      iso_locale_code: 'ur',
      item_name: 'کولنگ سسٹم',
      item_description:
        'ریڈی ایٹر، آئل کولر، اور فیول کولر کو چیک کریں اور صاف کریں۔',
    },
    {
      inspection_item_id: '01HK4WACP1CDWH6K22EAD0PNBS',
      iso_locale_code: 'ur',
      item_name: 'جبڑے کولہو',
      item_description: 'جبڑے کولہو کے لئے چیک کریں',
    },
    {
      inspection_item_id: '01HK4WACP3BEK5EQCVXYZED95Q',
      iso_locale_code: 'ur',
      item_name: 'بنیادی بیلٹ کنویئر',
      item_description: 'پرائمری بیلٹ کنویئر کو چیک کریں اور صاف کریں۔',
    },
    {
      inspection_item_id: '01HK4WACP4TSFPJZJA2C6NH64Y',
      iso_locale_code: 'ur',
      item_name: 'گریزلی فیڈر',
      item_description: 'گریزلی فیڈر چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4WACP4JTFZHAD5E59N1TPQ',
      iso_locale_code: 'ur',
      item_name: 'مقناطیسی جداکار',
      item_description: 'مقناطیسی جداکار کو چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4WACP4CPWCWVKNHB3Z1NEC',
      iso_locale_code: 'ur',
      item_name: 'الیکٹرک وائرنگ',
      item_description: 'بجلی کی وائرنگ چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4WACP4AFNJ3GZ2PJFSM6V7',
      iso_locale_code: 'ur',
      item_name: 'چراغ جلتے ہیں۔',
      item_description: 'چیک کریں کہ لیمپ روشن ہیں۔',
    },
    {
      inspection_item_id: '01HK4WACP44X5FEXGZJNMHQQ53',
      iso_locale_code: 'ur',
      item_name: 'ہارن',
      item_description: 'ہارن چیک کریں۔',
    },
    {
      inspection_item_id: '01HK4WF3YNBPKQP4H9SQX5ZVYK',
      iso_locale_code: 'ur',
      item_name: 'سروس میٹر (گھنٹہ)',
      item_description: '',
    },
    {
      inspection_item_id: '01HK4WFSFNKZFJY1FBDWXJ9QG3',
      iso_locale_code: 'ur',
      item_name: 'اوڈومیٹر (کلومیٹر)',
      item_description: '',
    },
  ];

  await insertOrUpsertTable(
    queryRunner,
    'inspection_item_template_translations',
    ['inspection_item_id', 'iso_locale_code'],
    data,
  );
};
