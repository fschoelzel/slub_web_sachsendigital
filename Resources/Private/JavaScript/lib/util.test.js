// @ts-check

import { beforeEach, describe, expect, test, jest } from '@jest/globals';
import { Blob } from 'buffer';
import { dataUrlMime, clamp, sanitizeBasename, withObjectUrl } from './util';

describe('clamp', () => {
  test('basic', () => {
    expect(clamp(1, [2, 3])).toBe(2);
    expect(clamp(2.5, [2, 3])).toBe(2.5);
    expect(clamp(4, [2, 3])).toBe(3);
  });
});

describe('dataUrlMime', () => {
  test('basic', () => {
    expect(dataUrlMime('data:image/png;abc')).toBe("image/png");
    expect(dataUrlMime('data:;')).toBe("");
    expect(dataUrlMime('data;')).toBe(undefined);
    expect(dataUrlMime('something')).toBe(undefined);
  });
});

describe('withObjectUrl', () => {
  const spyRevoke = jest.spyOn(URL, 'revokeObjectURL');

  beforeEach(() => {
    spyRevoke.mockReset();
  });

  test('returns result of callback', () => {
    // @ts-expect-error: DOM Blob vs Node Blob (TODO)
    expect(withObjectUrl(new Blob(), () => 1)).toBe(1);
    expect(spyRevoke).toHaveBeenCalledTimes(1);
  });

  test('returns async result', async () => {
    // @ts-expect-error: DOM Blob vs Node Blob (TODO)
    expect(await withObjectUrl(new Blob(), async () => 1)).toBe(1);
    expect(spyRevoke).toHaveBeenCalledTimes(1);
  });

  test('revokes despite throw', () => {
    let blobObjectUrl;

    expect(() => {
      // @ts-expect-error: DOM Blob vs Node Blob (TODO)
      withObjectUrl(new Blob(), (objectUrl) => {
        blobObjectUrl = objectUrl;
        throw new Error();
      });
    }).toThrow();

    expect(spyRevoke).toHaveBeenCalledTimes(1);
    expect(spyRevoke).toHaveBeenCalledWith(blobObjectUrl);
  });

  test('revokes despite async throw', async () => {
    let blobObjectUrl;

    await expect(async () => {
      // @ts-expect-error: DOM Blob vs Node Blob (TODO)
      await withObjectUrl(new Blob(), async (objectUrl) => {
        blobObjectUrl = objectUrl;
        throw new Error();
      });
    }).rejects.toThrow();

    expect(spyRevoke).toHaveBeenCalledTimes(1);
    expect(spyRevoke).toHaveBeenCalledWith(blobObjectUrl);
  });
});

describe('sanitizeBasename', () => {
  test('basic', () => {
    expect(sanitizeBasename("")).not.toBe("");
    expect(sanitizeBasename("Just for Fun")).toBe("Just_for_Fun");
    expect(sanitizeBasename("..")).toBe("_");
    expect(sanitizeBasename("1:2:3")).toBe("1_2_3");
  });
});