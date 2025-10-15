import { getAmountFiledHandler } from "./handlers/getCurrentGrievanceNumber"
import { publishHandler } from "./handlers/publishGrievance"

export const routes = [
    {
        method: 'POST' as const,
        path: '/path/to/handler',
        handler: publishHandler
    },
    {
        method: 'POST' as const,
        path: '/path/to/handler',
        handler: getAmountFiledHandler
    }
]