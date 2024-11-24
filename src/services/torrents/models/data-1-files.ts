import { z } from 'zod';

/**
 * The shape of the model inside the application code - what the users use
 */
export const data1Files = z.lazy(() => {
  return z.object({
    name: z.string().optional(),
    size: z.number().optional(),
  });
});

/**
 *
 * @typedef  {Data1Files} data1Files
 * @property {string}
 * @property {number}
 */
export type Data1Files = z.infer<typeof data1Files>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const data1FilesResponse = z.lazy(() => {
  return z
    .object({
      name: z.string().optional(),
      size: z.number().optional(),
    })
    .transform((data) => ({
      name: data['name'],
      size: data['size'],
    }));
});

/**
 * The shape of the model mapping from the application shape into the api schema.
 * Is equal to application shape if all property names match the api schema
 */
export const data1FilesRequest = z.lazy(() => {
  return z.object({ name: z.string().nullish(), size: z.number().nullish() }).transform((data) => ({
    name: data['name'],
    size: data['size'],
  }));
});
