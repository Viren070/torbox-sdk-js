import { z } from 'zod';
import { DataFiles2, dataFiles2, dataFiles2Request, dataFiles2Response } from './data-files-2';

/**
 * The shape of the model inside the application code - what the users use
 */
export const getTorrentInfoOkResponseData = z.lazy(() => {
  return z.object({
    files: z.array(dataFiles2).optional(),
    hash: z.string().optional(),
    name: z.string().optional(),
    peers: z.number().optional(),
    seeds: z.number().optional(),
    size: z.number().optional(),
    trackers: z.array(z.any()).optional(),
  });
});

/**
 *
 * @typedef  {GetTorrentInfoOkResponseData} getTorrentInfoOkResponseData
 * @property {DataFiles2[]}
 * @property {string}
 * @property {string}
 * @property {number}
 * @property {number}
 * @property {number}
 * @property {any[]}
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
      peers: z.number().optional(),
      seeds: z.number().optional(),
      size: z.number().optional(),
      trackers: z.array(z.any()).optional(),
    })
    .transform((data) => ({
      files: data['files'],
      hash: data['hash'],
      name: data['name'],
      peers: data['peers'],
      seeds: data['seeds'],
      size: data['size'],
      trackers: data['trackers'],
    }));
});

/**
 * The shape of the model mapping from the application shape into the api schema.
 * Is equal to application shape if all property names match the api schema
 */
export const getTorrentInfoOkResponseDataRequest = z.lazy(() => {
  return z
    .object({
      files: z.array(dataFiles2Request).optional(),
      hash: z.string().optional(),
      name: z.string().optional(),
      peers: z.number().optional(),
      seeds: z.number().optional(),
      size: z.number().optional(),
      trackers: z.array(z.any()).optional(),
    })
    .transform((data) => ({
      files: data['files'],
      hash: data['hash'],
      name: data['name'],
      peers: data['peers'],
      seeds: data['seeds'],
      size: data['size'],
      trackers: data['trackers'],
    }));
});
