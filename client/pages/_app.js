import 'bootstrap/dist/css/bootstrap.css';
import { Header } from '../components/Header';
import buildClient from '../api/build-client';

const AppComponent = ({ Component, pageProps, currentUser }) => {
    return (
        <>
            <Header user={currentUser} />
            <div className='container'>
                <Component {...pageProps} currentUser={currentUser}></Component>
            </div>
        </>
    )
};

AppComponent.getInitialProps = async (appCtx) => {
    try {
        const client = buildClient(appCtx.ctx);
        const { data } = await client.get("/api/users/currentuser");
        let pageProps = {};
        if (appCtx.Component.getInitialProps) {
            pageProps = await appCtx.Component.getInitialProps(appCtx.ctx, client, data.currentUser);
        }
        return {
            pageProps,
            ...data
        }
    } catch (err) {
        console.log("err", err);
        return {}
    }
}

export default AppComponent;