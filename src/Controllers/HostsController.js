const fs = require("fs");
const ping = require("ping");
const users = JSON.parse(fs.readFileSync("data.json"));


exports.pingHosts = async (req,res) =>{
    const results = await Promise.all(users.map(async (user) => {
        const hosts = await Promise.all(user.hosts.map(async (host) => {
            try {
                const res = await ping.promise.probe(host.ip, { timeout: 0.5 });
                return { name: host.name, ip: host.ip, alive: res.alive };
            } catch {
                return { name: host.name, ip: host.ip, alive: false };
            }
        }));
        return { name: user.name, hosts };
    }));
    return results;
}


exports.getHostByIp = async (req, res) => {
    let ip = req.query.ip;
    ip = ip.replaceAll("-", ".");

    if (!ip) return res.status(400).json({ error: 'IP address is required to play a playbook.' });

    const ipRegex = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
    if (!ipRegex.test(ip)) return res.status(400).json({ error: 'Invalid IP address' });

    try {
        const results = await Promise.all(
            users.map(async (user) => {
                const matchingHost = user.hosts.filter(host => host.ip === ip);

                if (matchingHost.length === 0) return null;

                try {
                    const pingResult = await ping.promise.probe(ip, { timeout: 0.5 });
                    matchingHost[0].alive = pingResult.alive;
                } catch {
                    matchingHost[0].alive = false;
                }

                return {
                    name: user.name,
                    host: matchingHost[0],
                };
            })
        );

        const filteredResults = results.filter(Boolean);

        if (filteredResults.length === 0)
            return res.status(404).json({ error: 'No host found for this IP address' });

        res.status(200).json(filteredResults);

    } catch (error) {
        console.error('Erreur getHostByIp:', error);
        res.status(500).json({ error: "Unable to get host info" });
    }
};
