import { DECIMAL_REGEX } from '@shared/constants';
import { I18nService } from 'nestjs-i18n';

import { escapeHtml } from './commons';

export function generateHeader(
  year: string,
  month: string,
  inspectionForm: any,
  isoLocaleCode: string,
  i18n: I18nService,
) {
  const {
    groupName,
    manufacturer,
    machineType,
    customerMachineNumber,
    modelType,
    serialNumber,
    sign,
  } = i18n.t('message.inspectionPdf', {
    lang: isoLocaleCode,
  }) as Record<string, string>;

  return `
  <h1 class="fw-bold fs-14">${year}/${month}　${
    inspectionForm.inspectionFormName
  }</h1>
  <div class="check-detail-container mt-10">
    <div class="check-detail-block">
      <div class="wrapper-name">
        <div class="name">
          <div class="col-4">
            <div>
              <p class="fs-6">${groupName}</p>
              <p class="fs-7 mt-2 word-break only-2-line">${escapeHtml(
                inspectionForm.groupName,
              )}</p>
            </div>
            <div class="mt-5">
              <p class="fs-6">${customerMachineNumber}</p>
              <p class="fs-7 mt-2 word-break only-2-line">${escapeHtml(
                inspectionForm.machineName,
              )}</p>
            </div>
          </div>
          <div class="ml-16 col-4">
            <div>
              <p class="fs-6">${manufacturer}</p>
              <p class="fs-7 mt-2 word-break only-2-line">${escapeHtml(
                inspectionForm.customMachineManufacturerName ||
                  inspectionForm.machineManufacturerName,
              )}</p>
            </div>
            <div class="mt-5">
              <p class="fs-6">${modelType}</p>
              <p class="fs-7 mt-2 word-break only-2-line">${escapeHtml(
                inspectionForm.modelAndType,
              )}</p>
            </div>
          </div>
          <div class="ml-16 col-4">
            <div>
              <p class="fs-6">${machineType}</p>
              <p class="fs-7 mt-2 word-break only-2-line">${escapeHtml(
                inspectionForm.customTypeName || inspectionForm.machineType,
              )}</p>
            </div>
            <div class="mt-5">
              <p class="fs-6">${serialNumber}</p>
              <p class="fs-7 mt-2 word-break only-2-line">${escapeHtml(
                inspectionForm.serialNumber,
              )}</p>
            </div>
          </div>
        </div>
      </div>
      <table class="signature-table ml-16">
        <tbody>
          <tr>
            <td colspan="3" class="fs-6">${sign}</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
`;
}

export function generateTable(
  dateHeader: any,
  rowsByHeaderAndTitle: any,
  isoLocaleCode: string,
  i18n: I18nService,
) {
  let tables = '';
  const { reporter, inspectionItem } = i18n.t('message.inspectionPdf', {
    lang: isoLocaleCode,
  }) as Record<string, string>;

  dateHeader.dateHeaderStrGroupByTable.forEach((date, tableIndex) => {
    const timeHeader = dateHeader.timeHeaderStrGroupByTable[tableIndex];
    const rowsByTitle = rowsByHeaderAndTitle[tableIndex];
    tables += `
      ${tableIndex ? `<div class="page-break"></div>` : ''}
    `;
    tables += `
      <table class="inspection-detail-table">
        <tbody>
          <tr>
            <th class="list-title-block" rowspan="2">
              <div class="checktitle2">${inspectionItem}</div>
            </th>
            ${date}
          </tr>
          <tr>
            ${timeHeader}
          </tr>
          ${rowsByTitle}
          ${
            rowsByTitle != ''
              ? `
                <tr class="check-detail-row-title">
                  <th class="list-title-block">
                    ${reporter}
                  </th>
                  ${dateHeader.reporterRowStrGroupByTable[tableIndex]}
                </tr>
                `
              : ''
          }
        </tbody>
      </table>
    `;
    tableIndex++;
  });

  return tables;
}

export const inspectionResultType = {
  resultOk: `
    <svg xmlns="http://www.w3.org/2000/svg"
      width="7"
      height="5"
      viewBox="0 0 7 5"
      fill="none">
      <path d="M2.43169 3.79229L1.04169 2.40229L0.568359 2.87229L2.43169 4.73563L6.43169 0.735625L5.96169 0.265625L2.43169 3.79229Z"
        fill="#000407"/>
    </svg>
  `,
  resultAnomary: `
    <svg xmlns="http://www.w3.org/2000/svg"
      width="6"
      height="7"
      viewBox="0 0 6 7"
      fill="none">
      <path
        d="M4.24333 0.5H1.75667L0 2.25667V4.74333L1.75667 6.5H4.24333L6 4.74333V2.25667L4.24333 0.5ZM5.33333 4.46667L3.96667 5.83333H2.03333L0.666667 4.46667V2.53333L2.03333 1.16667H3.96667L5.33333 2.53333V4.46667Z"
        fill="#141218"/>
      <path
        d="M4.24333 0.5H1.75667L0 2.25667V4.74333L1.75667 6.5H4.24333L6 4.74333V2.25667L4.24333 0.5ZM5.33333 4.46667L3.96667 5.83333H2.03333L0.666667 4.46667V2.53333L2.03333 1.16667H3.96667L5.33333 2.53333V4.46667Z"
        fill="#D0BCFF"
        fill-opacity="0.05"/>
      <path
        d="M3 5.16667C3.18409 5.16667 3.33333 5.01743 3.33333 4.83333C3.33333 4.64924 3.18409 4.5 3 4.5C2.81591 4.5 2.66667 4.64924 2.66667 4.83333C2.66667 5.01743 2.81591 5.16667 3 5.16667Z"
        fill="#141218"/>
      <path
        d="M3 5.16667C3.18409 5.16667 3.33333 5.01743 3.33333 4.83333C3.33333 4.64924 3.18409 4.5 3 4.5C2.81591 4.5 2.66667 4.64924 2.66667 4.83333C2.66667 5.01743 2.81591 5.16667 3 5.16667Z"
        fill="#D0BCFF"
        fill-opacity="0.05"/>
      <path
        d="M2.66667 1.83333H3.33333V4.16667H2.66667V1.83333Z"
        fill="#141218"/>
      <path
        d="M2.66667 1.83333H3.33333V4.16667H2.66667V1.83333Z"
        fill="#D0BCFF"
        fill-opacity="0.05"/>
    </svg>
  `,
};

export function dateHeader(numOfColspan: number, date: number | string) {
  return `<th colspan="${numOfColspan}" class="day-cell ${
    date === '' ? 'hidden-cell' : ''
  }">
    ${date}
  </th>`;
}

export function timeHeader(time: string) {
  if (time !== '') {
    const [ampm, timeWithSeconds] = time.split(' ');
    const [hour, minute] = timeWithSeconds.split(':');

    return `<th class="time-cell">
      <div>
        <div>${ampm}</div>
        <div>${hour}:${minute}</div>
      </div>
    </th>`;
  }

  return `<th class="time-cell">${time}</th>`;
}

export function detailRowByTitle(itemName: string, row: any) {
  return `<tr class="check-detail-row-title">
    <th class="list-title-block">
      <span class="only-2-line word-break height-auto">${escapeHtml(
        itemName,
      )}</span>
    </th>
      ${row}
  </tr>`;
}

export function reporter(reporter = '') {
  return `<td class="check-detail-cell"><div class="meter-reporter"><span class="txt-pre">${escapeHtml(
    reporter,
  )}</span></div></td>`;
}

export function generationResult(result: string) {
  let data = result;

  if (DECIMAL_REGEX.test(result)) {
    data = Number(result).toLocaleString();
    if (result.endsWith('.0')) {
      data += '.0';
    }
  }

  return `<td class="check-detail-cell meter">${data}</td>`;
}
