import { describe, expect, test } from 'bun:test';
import type { Settings } from '@boite/contracts';
import type { Flags } from './main.ts';
import { resolveHost } from './listen-host.ts';

const flags = (host: string): Flags => ({ host, hostExplicit: true } as Flags);
const settings = { listenOnLan: false } as Settings;

describe('resolveHost', () => {
  test('keeps valid loopback hosts when LAN is forbidden', () => {
    for (const host of ['localhost', '::1', '127.0.0.1', '127.255.255.255']) {
      expect(resolveHost(flags(host), settings, true)).toBe(host);
    }
  });

  test('rejects malformed and non-loopback IPv4 addresses when LAN is forbidden', () => {
    for (const host of ['127.999.0.1', '127.1', '127.0.0.0.1', '128.0.0.1', '0.0.0.0']) {
      expect(resolveHost(flags(host), settings, true)).toBe('127.0.0.1');
    }
  });
});
