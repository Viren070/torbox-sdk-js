import { z } from 'zod';
import { xxxxxxxxxxxxxxxxxx, xxxxxxxxxxxxxxxxxxRequest, xxxxxxxxxxxxxxxxxxResponse } from './xxxxxxxxxxxxxxxxxx';
import { xxxxxxxxxxxxxxxxxxx, xxxxxxxxxxxxxxxxxxxRequest, xxxxxxxxxxxxxxxxxxxResponse } from './xxxxxxxxxxxxxxxxxxx';

/**
 * The shape of the model inside the application code - what the users use
 */
export const data2 = z.lazy(() => {
  return z.object({
    xxxxxxxxxxxxxxxxxx: xxxxxxxxxxxxxxxxxx.optional(),
    xxxxxxxxxxxxxxxxxxx: xxxxxxxxxxxxxxxxxxx.optional(),
  });
});

/**
 *
 * @typedef  {Data2} data2
 * @property {Xxxxxxxxxxxxxxxxxx}
 * @property {Xxxxxxxxxxxxxxxxxxx}
 */
export type Data2 = z.infer<typeof data2>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const data2Response = z.lazy(() => {
  return z
    .object({
      XXXXXXXXXXXXXXXXXX: xxxxxxxxxxxxxxxxxxResponse.optional(),
      XXXXXXXXXXXXXXXXXXX: xxxxxxxxxxxxxxxxxxxResponse.optional(),
    })
    .transform((data) => ({
      xxxxxxxxxxxxxxxxxx: data['XXXXXXXXXXXXXXXXXX'],
      xxxxxxxxxxxxxxxxxxx: data['XXXXXXXXXXXXXXXXXXX'],
    }));
});

/**
 * The shape of the model mapping from the application shape into the api schema.
 * Is equal to application shape if all property names match the api schema
 */
export const data2Request = z.lazy(() => {
  return z
    .object({
      xxxxxxxxxxxxxxxxxx: xxxxxxxxxxxxxxxxxxRequest.nullish(),
      xxxxxxxxxxxxxxxxxxx: xxxxxxxxxxxxxxxxxxxRequest.nullish(),
    })
    .transform((data) => ({
      XXXXXXXXXXXXXXXXXX: data['xxxxxxxxxxxxxxxxxx'],
      XXXXXXXXXXXXXXXXXXX: data['xxxxxxxxxxxxxxxxxxx'],
    }));
});
