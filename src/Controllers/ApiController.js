const dotenv = require('dotenv')
const { exec } = require("child_process");
dotenv.config();

const playbookPath = process.env.PLAYBOOK_PATH;
const privateKeyPath = process.env.PRIVATE_KEY_PATH;

exports.runPlayBook = async (req, res) => {
  try {
    let { ip, playbook } = req.query;
    ip = ip.replaceAll("-",".");

    if (!ip) return res.status(400).json({ error: 'IP address is required to play a playbook.' });
    if (playbook=="") return res.status(400).json({ error: 'Playbook name cannot be empty.' });
    const ipRegex = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
    if (!ipRegex.test(ip)) return res.status(400).json({ error: 'Invalid IP address' });

    const cmd = `ANSIBLE_HOST_KEY_CHECKING=FALSE ansible-playbook ${playbookPath}/${playbook} -i ${ip}, --private-key=${privateKeyPath}`;
    //TEST
    //const cmd = `df -h`;
    
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

exports.getAvailablePlaybooks = (req,res) =>{
  try {
    cmd = `ls ${playbookPath}`;

    exec(cmd, { maxBuffer: 1024 * 1024}, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error while searching for available playbooks: ${error.message}`);
          return res.status(500).json({ error: `Error while searching for available playbooks ${playbook}: ${error.message}` });
        }
        stdout = stdout.split('\n');
        stdout.pop();
        res.json({ stdout, stderr });
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}