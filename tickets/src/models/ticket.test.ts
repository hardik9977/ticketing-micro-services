import { Ticket } from "./ticket"

it("Version number should be updated", async () => {
    const ticket = Ticket.build({
        title: "Test",
        price: 123,
        userId: "1222323"
    });

    await ticket.save();

    const first = await Ticket.findById(ticket.id);
    const second = await Ticket.findById(ticket.id);

    first?.set('title', "test1");
    second?.set('title', "test2");
    await first?.save();
    expect(first?.version).toBe(1)
    try {
        await second?.save();
    } catch {
        return
    }
    throw new Error("Should not reach this point");
}) 