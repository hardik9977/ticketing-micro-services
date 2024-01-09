import { useState } from "react"
import { useRequest } from "../../hooks/use-request";
import { useRouter } from "next/router";

const NewTicket = () => {

    const [title, setTitle] = useState("");
    const [price, setPrice] = useState(0.00);
    const router = useRouter();

    const [doRequest, errors] = useRequest({
        url: '/api/tickets',
        method: 'post',
        body: {
            title,
            price
        },
        onSuccess: (tickets) => {
            router.push("/")
        }
    });

    const onSubmit = async (e) => {
        e.preventDefault();
        await doRequest();
    }

    return (
        <div>
            <h1>Create a Ticket</h1>
            <form onSubmit={onSubmit}>
                <div className="from-group">
                    <label>Title</label>
                    <input className="form-control" value={title} onChange={(e) => { setTitle(e.target.value) }} />
                </div>
                <div className="from-group">
                    <label>Price</label>
                    <input className="form-control" value={price} onChange={(e) => { setPrice(e.target.value) }} />
                </div>
                <button className="btn btn-primary">Create</button>
                {errors}
            </form>
        </div>
    )
}

export default NewTicket