// This file is created by egg-ts-helper@1.25.7
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportV1Applicants = require('../../../app/service/v1/applicants');
import ExportV1Wxactivity = require('../../../app/service/v1/wxactivity');

declare module 'egg' {
  interface IService {
    v1: {
      applicants: AutoInstanceType<typeof ExportV1Applicants>;
      wxactivity: AutoInstanceType<typeof ExportV1Wxactivity>;
    }
  }
}
