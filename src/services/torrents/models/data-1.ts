import { z } from 'zod';
import { data1Files, data1FilesRequest, data1FilesResponse } from './data-1-files';

/**
 * The shape of the model inside the application code - what the users use
 */
export const data1 = z.lazy(() => {
  return z.object({
    files: z.array(data1Files).optional(),
    hash: z.string().optional(),
    name: z.string().optional(),
    size: z.number().optional(),
  });
});

/**
 *
 * @typedef  {Data1} data1
 * @property {Data1Files[]}
 * @property {string}
 * @property {string}
 * @property {number}
 */
export type Data1 = z.infer<typeof data1>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const data1Response = z.lazy(() => {
  return z
    .object({
      files: z.array(data1FilesResponse).optional(),
      hash: z.string().optional(),
      name: z.string().optional(),
      size: z.number().optional(),
    })
    .transform((data) => ({
      files: data['files'],
      hash: data['hash'],
      name: data['name'],
      size: data['size'],
    }));
});

/**
 * The shape of the model mapping from the application shape into the api schema.
 * Is equal to application shape if all property names match the api schema
 */
export const data1Request = z.lazy(() => {
  return z
    .object({
      files: z.array(data1FilesRequest).nullish(),
      hash: z.string().nullish(),
      name: z.string().nullish(),
      size: z.number().nullish(),
    })
    .transform((data) => ({
      files: data['files'],
      hash: data['hash'],
      name: data['name'],
      size: data['size'],
    }));
});
