import { getConfig, getAllowedChannels, getLogs } from './actions';
import Dashboard from './components/Dashboard';

export const dynamic = 'force-dynamic'; // Prevent caching of logs

export default async function Home() {
    const [config, channels, logs] = await Promise.all([
        getConfig(),
        getAllowedChannels(),
        getLogs()
    ]);

    return <Dashboard config={config} channels={channels} logs={logs} />;
}
