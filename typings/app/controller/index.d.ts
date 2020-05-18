// This file is created by egg-ts-helper@1.25.7
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportHome = require('../../../app/controller/home');
import ExportV1Wxactivity = require('../../../app/controller/v1/wxactivity');

declare module 'egg' {
  interface IController {
    home: ExportHome;
    v1: {
      wxactivity: ExportV1Wxactivity;
    }
  }
}
