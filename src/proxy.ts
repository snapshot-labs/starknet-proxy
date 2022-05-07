import express from 'express';
import fetch from 'cross-fetch';
import { get, set } from './aws';
import { sha256 } from './utils';

const router = express.Router();

router.get('/*', async (req, res) => {
  const key = sha256(req.originalUrl);
  const url = `https://alpha4.starknet.io${req.originalUrl}`;
  try {
    const cache = await get(key);
    if (cache) return res.json(cache);
    const result = await fetch(url);
    const json = await result.json();
    res.json(json);
    if (req.originalUrl.startsWith('/feeder_gateway/get_block') && json.status === 'ACCEPTED_ON_L1')
      await set(key, json);
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
});

export default router;
