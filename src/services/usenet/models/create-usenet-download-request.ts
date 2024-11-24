import { z } from 'zod';

/**
 * The shape of the model inside the application code - what the users use
 */
export const createUsenetDownloadRequest = z.lazy(() => {
  return z.object({
    file: z.instanceof(ArrayBuffer).optional(),
    link: z.string().optional(),
  });
});

/**
 *
 * @typedef  {CreateUsenetDownloadRequest} createUsenetDownloadRequest
 * @property {ArrayBuffer} - An NZB File. Optional.
 * @property {string} - An accessible link to an NZB file. Cannot be a redirection. Optional.
 */
export type CreateUsenetDownloadRequest = z.infer<typeof createUsenetDownloadRequest>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const createUsenetDownloadRequestResponse = z.lazy(() => {
  return z
    .object({
      file: z.instanceof(ArrayBuffer).optional(),
      link: z.string().optional(),
    })
    .transform((data) => ({
      file: data['file'],
      link: data['link'],
    }));
});

/**
 * The shape of the model mapping from the application shape into the api schema.
 * Is equal to application shape if all property names match the api schema
 */
export const createUsenetDownloadRequestRequest = z.lazy(() => {
  return z.object({ file: z.instanceof(ArrayBuffer).nullish(), link: z.string().nullish() }).transform((data) => ({
    file: data['file'],
    link: data['link'],
  }));
});
