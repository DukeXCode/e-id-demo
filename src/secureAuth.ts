import {getPublicKey, signPayload} from "@/src/crypto";
import axios from "axios";

const SERVER_ENDPOINT = "https://q999e.wiremockapi.cloud/auth";

const authenticateLocal = async (callbackUrl: string)=> {
    try {
        const pk = await getPublicKey();
        const response = await axios.post(SERVER_ENDPOINT, {
            publicKey: pk,
            callbackUrl: callbackUrl,
            message: signPayload("User verification."),
        });
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error posting data:', error);
    }
}

export default authenticateLocal;
