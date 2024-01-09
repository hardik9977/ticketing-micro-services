import Link from 'next/link';
import React from 'react';
const LandingPage = ({ currentUser, tickets }) => {
    const ticketList = tickets.map(ticket => {
        return (
            <tr key={ticket.id}>
                <td>{ticket.title}</td>
                <td>{ticket.price}</td>
                <td>
                    <Link href='/tickets/[ticketId]' as={`/tickets/${ticket.id}`}>
                        view
                    </Link>
                </td>
            </tr>
        )
    })
    return (
        <div>
            <h1>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ticketList}
                    </tbody>
                </table>
            </h1>
        </div>
    )
}
export default LandingPage

LandingPage.getInitialProps = async (context, client, currentUser) => {
    const { data } = await client.get('/api/tickets');
    return {
        tickets: data.tickets
    }
}
