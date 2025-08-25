import { z } from 'zod';

/**
 * The shape of the model inside the application code - what the users use
 */
export const dataFiles4 = z.lazy(() => {
  return z.object({
    id: z.number().optional(),
    md5: z.string().optional().nullable(),
    mimetype: z.string().optional(),
    name: z.string().optional(),
    s3Path: z.string().optional(),
    shortName: z.string().optional(),
    size: z.number().optional(),
  });
});

/**
 *
 * @typedef  {DataFiles4} dataFiles4
 * @property {number}
 * @property {string}
 * @property {string}
 * @property {string}
 * @property {string}
 * @property {string}
 * @property {number}
 */
export type DataFiles4 = z.infer<typeof dataFiles4>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const dataFiles4Response = z.lazy(() => {
  return z
    .object({
      id: z.number().optional(),
      md5: z.string().optional().nullable(),
      mimetype: z.string().optional(),
      name: z.string().optional(),
      s3_path: z.string().optional(),
      short_name: z.string().optional(),
      size: z.number().optional(),
    })
    .transform((data) => ({
      id: data['id'],
      md5: data['md5'],
      mimetype: data['mimetype'],
      name: data['name'],
      s3Path: data['s3_path'],
      shortName: data['short_name'],
      size: data['size'],
    }));
});

/**
 * The shape of the model mapping from the application shape into the api schema.
 * Is equal to application shape if all property names match the api schema
 */
export const dataFiles4Request = z.lazy(() => {
  return z
    .object({
      id: z.number().optional(),
      md5: z.string().optional().nullable(),
      mimetype: z.string().optional(),
      name: z.string().optional(),
      s3Path: z.string().optional(),
      shortName: z.string().optional(),
      size: z.number().optional(),
    })
    .transform((data) => ({
      id: data['id'],
      md5: data['md5'],
      mimetype: data['mimetype'],
      name: data['name'],
      s3_path: data['s3Path'],
      short_name: data['shortName'],
      size: data['size'],
    }));
});
