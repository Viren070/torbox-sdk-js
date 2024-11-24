import { z } from 'zod';

/**
 * The shape of the model inside the application code - what the users use
 */
export const createWebDownloadRequest = z.lazy(() => {
  return z.object({
    link: z.string().optional(),
  });
});

/**
 *
 * @typedef  {CreateWebDownloadRequest} createWebDownloadRequest
 * @property {string} - An accessible link to any file on the internet. Cannot be a redirection.
 */
export type CreateWebDownloadRequest = z.infer<typeof createWebDownloadRequest>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const createWebDownloadRequestResponse = z.lazy(() => {
  return z
    .object({
      link: z.string().optional(),
    })
    .transform((data) => ({
      link: data['link'],
    }));
});

/**
 * The shape of the model mapping from the application shape into the api schema.
 * Is equal to application shape if all property names match the api schema
 */
export const createWebDownloadRequestRequest = z.lazy(() => {
  return z.object({ link: z.string().nullish() }).transform((data) => ({
    link: data['link'],
  }));
});
