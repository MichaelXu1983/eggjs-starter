// This file is created by egg-ts-helper@1.25.7
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportErrorHandler = require('../../../app/middleware/error_handler');
import ExportRobot = require('../../../app/middleware/robot');

declare module 'egg' {
  interface IMiddleware {
    errorHandler: typeof ExportErrorHandler;
    robot: typeof ExportRobot;
  }
}
