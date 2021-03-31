import {
  LEAGUE_ID_KEY1,
  HALF_HOUR,
  WEEK,
  MONTH,
  YEAR,
} from "../others/config.js";

const API_HOST = `app.sportdataapi.com/api/v1/soccer`;
const API_KEY = `7548f260-66c2-11eb-8cf1-cfec162038ad`;
const API_KEY2 = `b7378ec0-6644-11eb-aa1d-d5b666f6a0bb`;

class API {
  constructor() {
    this.cacheExpire = JSON.parse(localStorage.getItem("cacheExpire")) || {};
  }

  async initCache(cacheName) {
    this.cache = await caches.open(cacheName);
    await this.clearCache();
  }

  async clearCache() {
    const expired = Object.keys(this.cacheExpire).filter((url) => {
      return new Date(Date.now()) > new Date(this.cacheExpire[url]);
    });

    const res = await Promise.all(
      expired.map((url) => {
        delete this.cacheExpire[url];
        return this.cache.delete(url);
      })
    );

    // update cache expire
    localStorage.setItem("cacheExpire", JSON.stringify(this.cacheExpire));
    console.log(`deleted ${res.length} caches`);
  }

  async request(URL, expire) {
    try {
      // check cache
      const cacheRes = await this.cache.match(URL);

      // cached & not expired
      if (
        cacheRes &&
        this.cacheExpire[URL] &&
        new Date(this.cacheExpire[URL]) > Date.now()
      ) {
        const { data } = await cacheRes.json();

        return data;
      }
      // add to cache
      else {
        const res = await fetch(URL);
        if (!res.ok) throw res.status;

        await this.cache.put(URL, res);
        this.cacheExpire[URL] = expire;

        /// update cache expire
        localStorage.setItem("cacheExpire", JSON.stringify(this.cacheExpire));

        const cacheRes = await this.cache.match(URL);
        const { data } = await cacheRes.json();
        return data;
      }
    } catch (err) {
      throw err;
    }
  }

  getLeague(leagueId) {
    const KEY = LEAGUE_ID_KEY1.includes(+leagueId) ? API_KEY : API_KEY2;
    const URL = `https://${API_HOST}/leagues/${leagueId}?apikey=${KEY}`;
    const expire = new Date(Date.now() + YEAR);

    return this.request(URL, expire);
  }

  getCountry(countryId) {
    const URL = `https://${API_HOST}/countries/${countryId}?apikey=${API_KEY}`;
    const expire = new Date(Date.now() + YEAR);

    return this.request(URL, expire);
  }

  getSeason(leagueId) {
    const KEY = LEAGUE_ID_KEY1.includes(+leagueId) ? API_KEY : API_KEY2;
    const URL = `https://${API_HOST}/seasons/?apikey=${KEY}&league_id=${leagueId}`;

    const expire = new Date(Date.now() + MONTH);
    return this.request(URL, expire);
  }

  getStandings(leagueId, seasonId) {
    const KEY = LEAGUE_ID_KEY1.includes(+leagueId) ? API_KEY : API_KEY2;
    const URL = `https://${API_HOST}/standings?apikey=${KEY}&season_id=${seasonId}`;

    const expire = new Date(Date.now() + HALF_HOUR);
    return this.request(URL, expire);
  }

  getTeam(leagueId, teamId) {
    const KEY = LEAGUE_ID_KEY1.includes(+leagueId) ? API_KEY : API_KEY2;
    const URL = `https://${API_HOST}/teams/${teamId}?apikey=${KEY}`;

    const expire = new Date(Date.now() + MONTH);
    return this.request(URL, expire);
  }

  getMatchResults(leagueId, seasonId, isMonth = false) {
    const KEY = LEAGUE_ID_KEY1.includes(+leagueId) ? API_KEY : API_KEY2;
    const from = new Date(Date.now() - (isMonth ? MONTH : WEEK))
      .toISOString()
      .slice(0, 10);
    const to = new Date(Date.now()).toISOString().slice(0, 10);
    const URL = `https://${API_HOST}/matches?apikey=${KEY}&season_id=${seasonId}&date_from=${from}&date_to=${to}`;

    const expire = new Date(Date.now() + HALF_HOUR);
    return this.request(URL, expire);
  }

  getMatchUpcoming(leagueId, seasonId, isMonth = false) {
    const KEY = LEAGUE_ID_KEY1.includes(+leagueId) ? API_KEY : API_KEY2;
    const from = new Date(Date.now()).toISOString().slice(0, 10);
    const to = new Date(Date.now() + (isMonth ? MONTH : WEEK))
      .toISOString()
      .slice(0, 10);
    const URL = `https://${API_HOST}/matches?apikey=${KEY}&season_id=${seasonId}&date_from=${from}&date_to=${to}`;

    const expire = new Date(Date.now() + HALF_HOUR);
    return this.request(URL, expire);
  }

  getTopScorers(leagueId, seasonId) {
    const KEY = LEAGUE_ID_KEY1.includes(+leagueId) ? API_KEY : API_KEY2;
    const URL = `https://${API_HOST}/topscorers?apikey=${KEY}&season_id=${seasonId}`;

    const expire = new Date(Date.now() + HALF_HOUR);

    return this.request(URL, expire);
  }
}

export default new API();
