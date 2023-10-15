import type { IPInfo } from "~/domain/user-visit";
import type { IPInformer } from "./entities/ip-informer";

export class IPRegistryInformer implements IPInformer {
  #host = "https://api.ipregistry.co";

  #token = "";

  constructor() {
    this.#token = process.env.IP_REGISTRY_TOKEN;
  }

  async #query(ip: string) {
    const url = new URL(`/${ip}`, this.#host);

    url.searchParams.set("key", this.#token);

    const response = await fetch(url.toString());
    const result = await response.json();

    if (!result.ip) {
      // It`s OK
      // You tried to look up a site local (private) IP address.
      // This kind of IP address cannot be used to deduce geolocation data (learn more at https://en.wikipedia.org/wiki/Private_network)
      if (result.code === "RESERVED_IP_ADDRESS") return;

      throw new Error(result);
    }

    return result;
  }

  async getByIp(ip: string): Promise<IPInfo | null> {
    const info = await this.#query(ip);

    if (!info) return null;

    return {
      ip: info.ip,
      hostname: info.hostname,
      country: {
        code: info.location?.country?.code,
        name: info.location?.country?.name,
      },
      region: {
        code: info.location?.region?.code,
        name: info.location?.region?.name,
      },
      city: info.location?.city,
      latitude: info.location?.latitude,
      longitude: info.location?.longitude,
      security: {
        isAbuser: info.security?.is_abuser || false,
        isVpn: info.security?.is_vpn || false,
      },
      timeZone: {
        id: info.time_zone?.id,
        name: info.time_zone?.name,
      },
      currency: {
        code: info.currency?.code,
        name: info.currency?.name,
      },
    };
  }
}
