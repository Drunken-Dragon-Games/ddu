import { Request } from "express-jwt";
import { Response, NextFunction } from "express";
import ApiError from "../error/api_error";
import { withTracing } from "../../base-logger";
import { IdentityService } from "../../../service-identity";

export const getStakeAddressMiddleware = (identityService: IdentityService) => async (request: Request, response: Response, next: NextFunction) => {
    if (request.auth == undefined) return next()
    try {
        const logger = withTracing(request)
        const userInfo = await identityService.resolveUser({ ctype: "user-id", userId: request.auth!.userId }, logger)
        if (userInfo.status == "unknown-user-id") throw new ApiError(401, "unknown_user_id", "Credentials contained bad user id")
        if (userInfo.info.knownStakeAddresses.length > 0) {
            request.auth!.stake_address = userInfo.info.knownStakeAddresses[0]
        }
        next()
    } catch (error) {
        next(error)
    }
}