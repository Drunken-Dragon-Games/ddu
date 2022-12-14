import { LoggingContext } from "../tools-tracing";
import * as models from "./models"
import { AssetManagementService } from "./service-spec"

export class AssetManagementServiceLogging implements AssetManagementService {

    constructor(private base: AssetManagementService) {}

    private withComponent(logger?: LoggingContext): LoggingContext | undefined {
        return logger?.withComponent("asset-management-service")
    }

    async loadDatabaseModels(): Promise<void> { 
        await this.base.loadDatabaseModels() 
    }

    async unloadDatabaseModels(): Promise<void> { 
        await this.base.unloadDatabaseModels() 
    }

    async health(logger?: LoggingContext): Promise<models.HealthStatus> {
        const serviceLogger = this.withComponent(logger)
        const status = await this.base.health(serviceLogger)
        if (status.status != "ok") 
            serviceLogger?.log.warn("unhealthy", { status } )
        return status 
    }

    async registry(logger?: LoggingContext): Promise<models.RegistryPolicy[]> {
        const serviceLogger = this.withComponent(logger)
        serviceLogger?.log.info("fetching asset registry")
        const response = await this.base.registry(serviceLogger)
        return response
    }

    async list(userId: string, logger?: LoggingContext, options?: { count?: number, page?: number, chain?: boolean , policies?: string[] }): Promise<models.ListResponse> {
        const serviceLogger = this.withComponent(logger)
        const response = await this.base.list(userId, serviceLogger, options)
        serviceLogger?.log.info(`listing assets for user ${userId}, result was ${response.status}`, options)
        return response
    }

    async grant(userId: string, asset: { unit: string, policyId: string, quantity: string }, logger?: LoggingContext): Promise<models.GrantResponse> {
        const serviceLogger = this.withComponent(logger)
        serviceLogger?.log.info(`granting assets to user ${userId}`, { asset })
        const response = await this.base.grant(userId, asset, serviceLogger)
        if (response.status == "invalid")
            serviceLogger?.log.info(`invalid asset grant to user ${userId} reason:${response.reason}`)
        else 
            serviceLogger?.log.info(`grant successful`)
        return response
    }

    async claim(userId: string, stakeAddress: string, asset: { unit: string, policyId: string, quantity?: string }, logger?: LoggingContext): Promise<models.ClaimResponse> {
        const serviceLogger = this.withComponent(logger)
        serviceLogger?.log.info(`claiming assets for user ${userId}`, { stakeAddress, asset })
        const response = await this.base.claim(userId, stakeAddress, asset, serviceLogger)
        if (response.status == "invalid")
            serviceLogger?.log.info(`invalid claim for user ${userId} reason:${response.reason}`)
        else 
            serviceLogger?.log.info(`claim successful`)
        return response
    }

    async submitClaimSignature(claimId: string, tx: string, witness: string, logger?: LoggingContext): Promise<models.SubmitClaimSignatureResponse> {
        const serviceLogger = this.withComponent(logger)
        serviceLogger?.log.info(`Submitting claim signature for claim ${claimId}`)
        const response = await this.base.submitClaimSignature(claimId, tx, witness, serviceLogger)
        if (response.status == "invalid")
            serviceLogger?.log.info(`Claim signature invalid for claim ${claimId} reason:${response.reason}`)
        else 
            serviceLogger?.log.info(`claim signature submited`)
        return response
    }

    async claimStatus(claimId: string, logger?: LoggingContext): Promise<models.ClaimStatusResponse> {
        const serviceLogger = this.withComponent(logger)
        const response = await this.base.claimStatus(claimId, serviceLogger)
        if (response.status == "invalid")
            serviceLogger?.log.info(`Claim ${claimId} status invalid reason:${response.reason}`)
        else 
            serviceLogger?.log.info(`Claim ${claimId} status ok`)
        return response
    }
}
