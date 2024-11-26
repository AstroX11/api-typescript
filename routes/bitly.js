import { BitlyClient } from 'bitly';

const bitly = new BitlyClient('6e7f70590d87253af9359ed38ef81b1e26af70fd');

const shortenUrl = async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
        const response = await bitly.shorten(url);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default shortenUrl;
