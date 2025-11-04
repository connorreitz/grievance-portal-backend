import { getAmountFiledHandler } from "./handlers/getCurrentGrievanceNumber"
import { publishHandler } from "./handlers/publishGrievance"

export const routes = [
    {
        method: 'GET' as const,
        path: '/count',
        handler: getAmountFiledHandler
    },
    {
        method: 'POST' as const,
        path: '/publish',
        handler: publishHandler
    },
    {
        method: 'OPTIONS' as const,
        path: '/{proxy+}',
        handler: async () => {
          return {
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': 'https://master.d3g6eijrr8jyz3.amplifyapp.com', // or specific origin like 'http://localhost:5173'
              'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type,Authorization',
            },
            body: '',
          }
        },
      },
]