import {getPublicKey} from "@/src/crypto";
import axios from "axios";

const SERVER_ENDPOINT = "https://q999e.wiremockapi.cloud/auth";

const authenticate = async (callbackUrl: string)=> {
    try {
        const pk = await getPublicKey();
        const response = await axios.post(SERVER_ENDPOINT, {
            publicKey: pk,
            callbackUrl: callbackUrl,
        });
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error posting data:', error);
    }
}

export default authenticate;
