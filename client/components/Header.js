import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRequest } from '../hooks/use-request';

const Header = ({ user }) => {
    const router = useRouter();
    const [doRequest, errors] = useRequest({
        url: 'api/users/signout',
        method: 'post',
        body: {},
        onSuccess: () => {
            router.push('/');
        }
    })
    const OnSignOut = async (e) => {
        e.preventDefault();
        console.log("OnSignOut")
        await doRequest();
    }
    return (
        <>
            <nav className="navbar navbar-light bg-light">
                <span className="navbar-brand mb-0 h1">Just Book It</span>
                <div className='d-flex justify-content-end'>
                    <ul className="nac d-flex align-items-center">
                        {
                            !user ? (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" href="/auth/signin">Sign In</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" href="/auth/signup">Sing Up</Link>
                                    </li>
                                </>
                            ) : (
                                <li className="nav-item">
                                    <Link className="nav-link" href="" onClick={(e) => { OnSignOut(e) }}>Sign Out</Link>
                                </li>
                            )
                        }
                    </ul>
                </div>
            </nav>
        </>
    )
}

export { Header }