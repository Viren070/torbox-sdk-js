import { z } from 'zod';
import { dataFiles2, dataFiles2Request, dataFiles2Response } from './data-files-2';

/**
 * The shape of the model inside the application code - what the users use
 */
export const getTorrentInfoOkResponseData = z.lazy(() => {
  return z.object({
    files: z.array(dataFiles2).optional(),
    hash: z.string().optional(),
    name: z.string().optional(),
    size: z.number().optional(),
  });
});

/**
 *
 * @typedef  {GetTorrentInfoOkResponseData} getTorrentInfoOkResponseData
 * @property {DataFiles2[]}
 * @property {string}
 * @property {string}
 * @property {number}
 */
export type GetTorrentInfoOkResponseData = z.infer<typeof getTorrentInfoOkResponseData>;

/**
 * The shape of the model mapping from the api schema into the application shape.
 * Is equal to application shape if all property names match the api schema
 */
export const getTorrentInfoOkResponseDataResponse = z.lazy(() => {
  return z
    .object({
      files: z.array(dataFiles2Response).optional(),
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
export const getTorrentInfoOkResponseDataRequest = z.lazy(() => {
  return z
    .object({
      files: z.array(dataFiles2Request).nullish(),
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
