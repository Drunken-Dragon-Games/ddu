import { LoggingContext } from "../tools-tracing"
import * as models from "./models"

export interface IdentityService {

    loadDatabaseModels(): Promise<void>

    unloadDatabaseModels(): Promise<void>

    health(logger?: LoggingContext): Promise<models.HealthStatus>

    createSigNonce(address: string, logger?: LoggingContext): Promise<models.CreateNonceResult>

    authenticate(credentials: models.Credentials, logger?: LoggingContext): Promise<models.AuthenticationResult>

    register(credentials: models.Credentials, logger?: LoggingContext): Promise<models.RegistrationResult>

    associate(userId: string, credentials: models.Credentials, logger?: LoggingContext): Promise<models.AssociationResult>

    refresh(sessionId: string, refreshToken: string, logger?: LoggingContext): Promise<models.RefreshResult>

    listSessions(userId: string, logger?: LoggingContext): Promise<models.ListSessionsResult>

    signout(sessionId: string, logger?: LoggingContext): Promise<models.SignOutResult>

    resolveUser(info: { ctype: "user-id", userId: string } | { ctype: "nickname", nickname: string }, logger?: LoggingContext): Promise<models.ResolveUserResult>

    resolveSession(sessionId: string, logger?: LoggingContext): Promise<models.ResolveSesionResult>

    updateUser(userId: string, info: { nickname: string }, logger?: LoggingContext): Promise<models.UpdateUserResult>
}
