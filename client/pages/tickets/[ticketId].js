const TicketShow = ({ ticket }) => {
    return (
        <div>
            <h1>{ticket?.title}</h1>
            <h4>Price: {ticket?.price}</h4>
        </div>
    )
}

export default TicketShow;

TicketShow.getInitialProps = async (context, client) => {
    const { ticketId } = context.query
    const { data } = await client.get(`/api/tickets/${ticketId}`);
    return { ticket: data.ticket }
}