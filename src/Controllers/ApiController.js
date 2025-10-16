const dotenv = require('dotenv')
dotenv.config();

const playbookPath = process.env.PLAYBOOK_PATH;
const privateKeyPath = process.env.PRIVATE_KEY_PATH;

exports.runPlayBook = async (req, res) => {
  try {
    const { ip } = req.query;

    if (!ip) return res.status(400).json({ error: 'IP address is required to play a playbook.' });

    const ipRegex = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
    if (!ipRegex.test(ip)) return res.status(400).json({ error: 'Invalid IP address' });

    const cmd = `ANSIBLE_HOST_KEY_CHECKING=FALSE ansible-playbook ${playbookPath} -i ${ip}, --private-key=${privateKeyPath}`;

    exec(cmd, { maxBuffer: 1024 * 1024}, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing playbook: ${error.message}`);
        return res.status(500).json({ error: `Error when running playbook ${playbook}: ${error.message}` });
      }
      res.json({ stdout, stderr });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}