import axios from "axios";

const URL = "http://localhost:3000/api";

async function sendRequest(id) {
    try {
        const response = await axios.get(URL);

        console.log(
            `Request ${id}:`,
            response.status,
            response.data.message
        );
    } catch (err) {
        console.log(
            `Request ${id}:`,
            err.response?.status,
            err.response?.data?.message
        );
    }
}

async function main() {
    const requests = [];

    for (let i = 1; i <= 20; i++) {
        requests.push(sendRequest(i));
    }

    await Promise.all(requests);
}

main();