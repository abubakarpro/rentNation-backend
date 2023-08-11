import { BadRequestException, Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private SecretStripe;
  private PublicStripe;
  private testCard_3D_Secure = '4000 0027 6000 3184';
  private testCard_Simple = '4242 4242 4242 4242';

  constructor() {
    this.SecretStripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });

    this.PublicStripe = new Stripe(process.env.STRIPE_PUBLIC_KEY, {
      apiVersion: '2022-11-15',
    });
  }

  // Create Stripe Token (Dummy Card)
  async createToken() {
    try {
      return await this.PublicStripe.tokens.create({
        card: {
          number: this.testCard_3D_Secure,
          exp_month: 1,
          exp_year: 2024,
          cvc: '314',
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Create Payment Method
  async createPaymentMethod(token) {
    try {
      return await this.PublicStripe.paymentMethods.create({
        type: 'card',
        card: {
          token: token.id,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Create Payment Intent
  async createPaymentIntent(data) {
    try {
      const { amount, currency, paymentMethodId } = data;
      return await this.SecretStripe.paymentIntents.create({
        amount,
        currency,
        payment_method_types: ['card'],
        payment_method: paymentMethodId,
        confirm: true,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
