import nats, { Stan } from 'node-nats-streaming';
class NatsWrapper {
    private _client?: Stan;

    get client() {
        if (!this._client) {
            throw new Error("connect first")
        }
        return this._client;
    }
    connect(clusteId: string, clientId: string, url: string): Promise<void> {
        this._client = nats.connect(clusteId, clientId, { url })


        return new Promise((resolve, reject) => {
            this.client.on('connect', () => {
                console.log("Connected to NATS");
                resolve();
            });
            this.client.on('error', (err) => {
                reject(err);
            })
        })
    }
}

export const natsWrapper = new NatsWrapper();