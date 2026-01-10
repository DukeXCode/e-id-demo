import {getPublicKey} from "@/src/crypto";
import axios from "axios";

const authenticate = async (callbackUrl: string)=> {
    try {
        const response = await axios.post(callbackUrl, {
            publicKey: getPublicKey(),
            callbackUrl: callbackUrl,
        });
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error posting data:', error);
    }
}

export default authenticate;
