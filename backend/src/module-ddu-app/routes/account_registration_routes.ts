import { Router } from "express"
import { IdentityService } from "../../service-identity";
import {
    discordRegistration,
    getAuthenticationNonce,
    verifySignature
} from "../controllers/account_controller"

const loadAccountRegisterRoutes = (identityService: IdentityService) => {
    const router = Router();
    /**
     * Wallet Registration Routes
     */
    router.post('/validate', getAuthenticationNonce(identityService));
    router.post('/validate/:nonce', verifySignature(identityService));
    
    /**
     * Discord Registration Routes
     */
    router.post('/discordRegistration', discordRegistration(identityService))
    return router
}


export default loadAccountRegisterRoutes;