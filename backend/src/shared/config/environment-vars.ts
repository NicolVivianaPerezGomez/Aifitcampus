import joi from 'joi';
import "dotenv/config";

export type ReturnEnvironmentVars = {
    PORT: number;
    DB_HOST: string;
    DB_PORT: number;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    ALLOWED_EMAIL_DOMAIN: string;
    
    // Microsoft 365 / Azure AD (HU-01: único mecanismo de autenticación)
    AZURE_TENANT_ID: string;
    AZURE_CLIENT_ID: string;
    AZURE_CLIENT_SECRET: string;
    AZURE_REDIRECT_URI: string;
    FRONTEND_URL: string;
}

type ValidationEnvironmentVars = {
    error: joi.ValidationError | undefined,
    value: ReturnEnvironmentVars
}

function validateEnvVars(vars: NodeJS.ProcessEnv): ValidationEnvironmentVars {
    const envSchema = joi.object({
        PORT: joi.number().required(),
        DB_HOST: joi.string().required(),
        DB_PORT: joi.number().default(5432),
        DB_USER: joi.string().required(),
        DB_PASSWORD: joi.string().allow("").optional(),
        DB_NAME: joi.string().required(),
        JWT_SECRET: joi.string().required(),
        JWT_EXPIRES_IN: joi.string().default("8h"),
        ALLOWED_EMAIL_DOMAIN: joi.string().allow("").default(""),
        AZURE_TENANT_ID: joi.string().required(),
        AZURE_CLIENT_ID: joi.string().required(),
        AZURE_CLIENT_SECRET: joi.string().required(),
        AZURE_REDIRECT_URI: joi.string().required(),
        FRONTEND_URL: joi.string().default("http://localhost:4200"),
    }).unknown(true);
    const { error, value } = envSchema.validate(vars);
    return { error, value }
}

const loadEnvVars = (): ReturnEnvironmentVars => {
    const result = validateEnvVars(process.env);
    if (result.error) {
        throw new Error(result.error.message)
    }
    const value = result.value;
    return {
        PORT: value.PORT,
        DB_HOST: value.DB_HOST,
        DB_PORT: value.DB_PORT,
        DB_USER: value.DB_USER,
        DB_PASSWORD: value.DB_PASSWORD,
        DB_NAME: value.DB_NAME,
        JWT_SECRET: value.JWT_SECRET,
        JWT_EXPIRES_IN: value.JWT_EXPIRES_IN,
        ALLOWED_EMAIL_DOMAIN: value.ALLOWED_EMAIL_DOMAIN,
        AZURE_TENANT_ID: value.AZURE_TENANT_ID,
        AZURE_CLIENT_ID: value.AZURE_CLIENT_ID,
        AZURE_CLIENT_SECRET: value.AZURE_CLIENT_SECRET,
        AZURE_REDIRECT_URI: value.AZURE_REDIRECT_URI,
        FRONTEND_URL: value.FRONTEND_URL,
    }
}

const envs = loadEnvVars();
export default envs;
