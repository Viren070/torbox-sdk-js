import { z } from 'zod';
import { _14, _14Request, _14Response } from './_14';

/**
 * The shape of the model inside the application code - what the users use
 */
export const _13 = z.lazy(() => {
  return z.union([z.string(), _14]);
});

/**
 *
 * @typedef  {_13} _13
 * @property {string}
 * @property {_14}
 */
export type _13 = z.infer<typeof _13>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const _13Response = z.lazy(() => {
  return z.union([z.string(), _14Response]);
});

/**
 * The shape of the model mapping from the application shape into the api schema.
 * Is equal to application shape if all property names match the api schema
 */
export const _13Request = z.lazy(() => {
  return z.union([z.string(), _14Request]);
});
