import * as dotenv from "dotenv"
import express, { Request, Response } from 'express';
import crypto from 'crypto';

dotenv.config();
const app = express();

// Body parser, reading data from body into req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/paystack_webhook', (req: Request, res: Response) => {
  try {
    const secret: string |undefined = JSON.stringify(process.env.SECRET_KEY);
    let hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
    // first step is to validate the paystack event
    if((hash == req.headers['x-paystack-signature'])){
        const webhookEvent = req.body;
        console.log(webhookEvent)
        return res.status(200).json({
            status: "SUCCESS",
            message: "Successful",
            data: webhookEvent,
          });
    }else{
        return res.status(401).json({
            status: "ERROR",
            message: "Invalid Event",
            data: null,
          }) 
    }
	
  } catch (error) {
    return res.status(500).json({
        status: "ERROR",
        message: error.message,
        data: null,
      }) 
  }
});

app.use((_req: Request, res: Response) => res.status(404).json({ error: 'Page not found' }));

export default app;