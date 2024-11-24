import { z } from 'zod';

/**
 * The shape of the model inside the application code - what the users use
 */
export const getUpStatusOkResponse = z.lazy(() => {
  return z.object({
    detail: z.string().optional(),
  });
});

/**
 *
 * @typedef  {GetUpStatusOkResponse} getUpStatusOkResponse
 * @property {string}
 */
export type GetUpStatusOkResponse = z.infer<typeof getUpStatusOkResponse>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const getUpStatusOkResponseResponse = z.lazy(() => {
  return z
    .object({
      detail: z.string().optional(),
    })
    .transform((data) => ({
      detail: data['detail'],
    }));
});

/**
 * The shape of the model mapping from the application shape into the api schema.
 * Is equal to application shape if all property names match the api schema
 */
export const getUpStatusOkResponseRequest = z.lazy(() => {
  return z.object({ detail: z.string().nullish() }).transform((data) => ({
    detail: data['detail'],
  }));
});
