const express = require('express');
const app = express();
const port = 3000;

const key = '1x0000000000000000000000000000000AA';

app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  res.sendFile('/workspaces/turnsite-example/index.html');
})

app.post('/verify', async (req, res) => {
    const token = req.body['cf-turnstile-response'];
	const ip = req.headers['cf-connecting-ip'];

    let formData = new FormData();
	formData.append('secret', key);
	formData.append('response', token);
	formData.append('remoteip', ip);

	try {
        const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            body: formData,
            method: 'POST',
        });

        const outcome = await result.json();

        if (outcome.success) {
            res.send('Verified Successfully');
        } else {
            res.send('Failure!');
        }
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send('An error occurred');
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})