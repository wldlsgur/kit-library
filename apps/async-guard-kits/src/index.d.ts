import type { PluginObj } from '@babel/core';
import type * as BabelTypes from '@babel/types';
interface AsyncGuardOptions {
    handler?: string;
}
export default function asyncGuardPlugin(api: {
    types: typeof BabelTypes;
}, options: AsyncGuardOptions): PluginObj;
export {};
