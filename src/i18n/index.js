import { messages as headerMessages } from '@edx/frontend-component-header';
import { messages as footerMessages } from '@edx/frontend-component-footer';
import { messages as paragonMessages } from '@openedx/paragon';

import arMessages from './messages/ar.json';
import caMessages from './messages/ca.json';
import dedeMessages from './messages/de_DE.json';
import frcaMessages from './messages/fr_CA.json';
import hiMessages from './messages/hi.json';
import ititMessages from './messages/it_IT.json';
import ptptMessages from './messages/pt_PT.json';
// no need to import en messages-- they are in the defaultMessage field
import es419Messages from './messages/es_419.json';
import frMessages from './messages/fr.json';
import zhcnMessages from './messages/zh_CN.json';
import heMessages from './messages/he.json';
import idMessages from './messages/id.json';
import kokrMessages from './messages/ko_kr.json';
import plMessages from './messages/pl.json';
import ptbrMessages from './messages/pt_br.json';
import ruMessages from './messages/ru.json';
import thMessages from './messages/th.json';
import ukMessages from './messages/uk.json';

const appMessages = {
  ar: arMessages,
  'es-419': es419Messages,
  fr: frMessages,
  'zh-cn': zhcnMessages,
  ca: caMessages,
  he: heMessages,
  id: idMessages,
  'ko-kr': kokrMessages,
  pl: plMessages,
  'pt-br': ptbrMessages,
  ru: ruMessages,
  th: thMessages,
  uk: ukMessages,
  'de-de': dedeMessages,
  'fr-ca': frcaMessages,
  hi: hiMessages,
  'it-it': ititMessages,
  'pt-pt': ptptMessages,
};

export default [
  headerMessages,
  footerMessages,
  paragonMessages,
  appMessages,
];
