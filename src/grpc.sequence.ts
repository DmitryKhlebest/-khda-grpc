// Copyright IBM Corp. 2017,2019. All Rights Reserved.
// Node module: @loopback/grpc
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {inject} from '@loopback/context';
import {ServerUnaryCall} from 'grpc';
import {GrpcBindings} from './keys';
import * as utils from './utils';

import debugFactory from 'debug';
const debug = debugFactory('loopback:grpc');

/**
 * Interface that describes a GRPC Sequence
 */
// tslint:disable-next-line: interface-name
export interface GrpcSequenceInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  unaryCall(request: ServerUnaryCall<any>): Promise<any>;
}

/**
 * GRPC Sequence
 */
export class GrpcSequence implements GrpcSequenceInterface {
  constructor(
    @inject(GrpcBindings.GRPC_CONTROLLER)
    // tslint:disable-next-line: ban-types
    protected controller: {[method: string]: Function},
    @inject(GrpcBindings.GRPC_METHOD_NAME) protected method: string,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async unaryCall(call: ServerUnaryCall<any>): Promise<any> {
    // Do something before call
    debug(
      'Calling %s.%s',
      this.controller.constructor.name,
      this.method,
      call.request,
    );
    const reply = utils.serialize(
      await this.controller[this.method](utils.deserialize(call.request))
    );
    // Do something after call
    return reply;
  }
}
