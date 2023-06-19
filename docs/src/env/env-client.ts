import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import * as process from "process";

const isProduction = process.env.NODE_ENV === "production";

let validation = z.string().optional();

if (isProduction) {
    validation = z.string().min(1).optional();
}

const env = createEnv({
    client: {
        NEXT_PUBLIC_FATHOM_ID: validation,
        NEXT_PUBLIC_COMMENTS_REPO: validation,
        NEXT_PUBLIC_COMMENTS_REPO_ID: validation,
        NEXT_PUBLIC_COMMENTS_CATEGORY_ID: validation,
    },
    /**
     * What object holds the environment variables at runtime.
     * Often `process.env` or `import.meta.env`
     */
    runtimeEnv: {
        NEXT_PUBLIC_FATHOM_ID: process.env["NEXT_PUBLIC_FATHOM_ID"],
        NEXT_PUBLIC_COMMENTS_REPO: process.env["NEXT_PUBLIC_COMMENTS_REPO"],
        NEXT_PUBLIC_COMMENTS_REPO_ID: process.env["NEXT_PUBLIC_COMMENTS_REPO_ID"],
        NEXT_PUBLIC_COMMENTS_CATEGORY_ID: process.env["NEXT_PUBLIC_COMMENTS_CATEGORY_ID"],
    },
});

export default env;
