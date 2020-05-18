// This file is created by egg-ts-helper@1.25.7
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportHome = require('../../../app/controller/home');
import ExportV1Applicants = require('../../../app/controller/v1/applicants');
import ExportV1Wxactivity = require('../../../app/controller/v1/wxactivity');

declare module 'egg' {
  interface IController {
    home: ExportHome;
    v1: {
      applicants: ExportV1Applicants;
      wxactivity: ExportV1Wxactivity;
    }
  }
}
