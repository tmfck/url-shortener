import Url from "../model/Url.js";
import subpartGenerator from "../util/subpartGenerator.js";
import config from "../util/config.js";

export default class IndexController {

  constructor({router, redis} = {}) {
    router.get('/', this.getIndex.bind(this));
    router.get('/:subpart\\+', this.getInfo.bind(this));
    router.get('/:subpart', this.getRedirect.bind(this));
    router.post('/shorten', this.postShorten.bind(this));
    this.redis = redis;
    return router;
  }

  async getIndex(req, res) {
    const user = req.sessionID;
    let { page, limit } = req.query;
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 3;
    if (page < 1) {
      page = 1;
    }
    let offset = (page - 1) * limit;
    const urls = await Url.where({ user }).limit(limit).skip(offset).sort({ createdAt: 'desc' });
    const urlsCount = await Url.where({ user }).count();
    const pageCount = Math.ceil(urlsCount / limit);
    res.render('index', {
      urls,
      page,
      limit,
      pages: pageCount
    });
  }

  async getInfo(req, res) {
    const { subpart } = req.params;
    try {
      let url = await this.redis.get(subpart);
      if (!url) {
        const urlEntry = await Url.findOne({subpart});
        if (!urlEntry) {
          return res.status(404).send('URL not found');
        }
        url = urlEntry.url;
        this.redis.set(subpart, url, "EX", 60);
      }
      res.send(url);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  }

  async getRedirect(req, res) {
    const { subpart } = req.params;
    try {
      let url = await this.redis.get(subpart);
      if (!url) {
        const urlEntry = await Url.findOne({subpart});
        if (!urlEntry) {
          return res.status(404).send('URL not found');
        }
        url = urlEntry.url;
        this.redis.set(subpart, url, "EX", 60);
      }
      res.redirect(url);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  }

  async postShorten(req, res) {
    const { url, subpart: customSubpart } = req.body;
    const user = req.sessionID;

    try {
      const subpart = customSubpart || (await subpartGenerator(1, config.maxSafeIntegerForGenerator));
      const existingUrl = await Url.findOne({ subpart });
      if (existingUrl) {
        if (customSubpart) {
          return res.status(400).send('Custom short URL already in use');
        }
        return res.status(500).send('Generated short URL already in use');
      }
      const urlEntry = new Url({ url, subpart, user });
      await urlEntry.save();

      res.redirect('/');
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  }

}